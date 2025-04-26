using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;
using Dapper;
using sgosat.Repositorio.Models.Clientes.Response;

namespace sgosat.Repositorio
{
    public class ClienteRepositorio : BaseRepositorio, IClienteRepositorio
    {
        public ClienteRepositorio(sgosatContexto contexto) : base(contexto)
        {
            
        }

        public async Task<int> Salvar(Cliente cliente)
        {
            _contexto.Clientes.Add(cliente);
            await _contexto.SaveChangesAsync();

            return cliente.ID;
        }

        public async Task Atualizar(Cliente cliente)
        {
            _contexto.Clientes.Update(cliente);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Cliente> Obter(int clienteID, bool Ativo)
        {
            return await _contexto.Clientes
                        .Where(c => c.ID == clienteID)
                        .Where(c => c.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }
        
        public async Task<Cliente> ObterPorDoc(string doc, bool Ativo)
        {
            return await _contexto.Clientes
                        .Where(p => p.Documento == doc)
                        .Where(p => p.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Cliente>> ObterPorTermo(string query, bool Ativo)
        {
            return await _contexto.Clientes
                        .Where(c => c.Nome.Contains(query) || c.Documento.Contains(query))
                        .Where(c => c.Ativo == Ativo)
                        .Take(10)
                        .ToListAsync();
        }

        public async Task<IEnumerable<Cliente>> Listar(bool Ativo)
        {
            return await _contexto.Clientes.Where(c => c.Ativo == Ativo).ToListAsync();
        }

        public async Task<IEnumerable<ClientePaginado>> Paginar(int pageNumber, int pageSize, int order, string nome, string documento)
        {         
            var parametros = new DynamicParameters();
            parametros.Add("@PageNumber", pageNumber);
            parametros.Add("@PageSize", pageSize);
            parametros.Add("@Order", order);
            parametros.Add("@Nome", nome);
            parametros.Add("@Documento", documento);

            return await _contexto.Database.GetDbConnection().QueryAsync<ClientePaginado>(
                "spObterClientesPaginados",
                parametros,
                commandType: System.Data.CommandType.StoredProcedure
            );
        }
    }
}