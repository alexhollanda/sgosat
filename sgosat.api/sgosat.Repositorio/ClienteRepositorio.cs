using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;
using Dapper;

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

        public async Task<IEnumerable<Cliente>> Paginar(int pageNumber, int pageSize, int order)
        {
            


            // CREATE PROCEDURE [dbo].[spObterClientesPaginados] (@PageNumber INT, @PageSize INT, @Order INT)
            // AS
            // BEGIN
	        //     SET NOCOUNT ON;
	        //     SELECT 
		    //         Cliente.*,
		    //         COUNT(*) OVER() AS TotalRegistros
	        //     FROM Cliente
	        //     ORDER BY 
		    //         CASE WHEN @Order = 1 THEN Cliente.ID END ASC,
		    //         CASE WHEN @Order = 2 THEN Cliente.Nome END ASC
	        //     OFFSET (@PageNumber - 1) * @PageSize ROWS
	        //     FETCH NEXT @PageSize ROWS ONLY;
            // END
            
            
            
            var parametros = new DynamicParameters();
            parametros.Add("@PageNumber", pageNumber);
            parametros.Add("@PageSize", pageSize);
            parametros.Add("@Order", order);

            return await _contexto.Database.GetDbConnection().QueryAsync<Cliente>(
                "spObterClientesPaginados",
                parametros,
                commandType: System.Data.CommandType.StoredProcedure
            );
        }
    }
}