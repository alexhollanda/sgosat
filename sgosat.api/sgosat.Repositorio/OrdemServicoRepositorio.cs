using Dapper;
using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;
using sgosat.Repositorio.Models.Ordens.Response;

namespace sgosat.Repositorio
{
    public class OrdemServicoRepositorio : BaseRepositorio, IOrdemServicoRepositorio
    {
        public OrdemServicoRepositorio(sgosatContexto contexto) : base(contexto)
        {
            
        }

        public async Task<int> Salvar(OrdemServico ordemServico)
        {
            _contexto.OrdensServicos.Add(ordemServico);
            await _contexto.SaveChangesAsync();

            return ordemServico.ID;
        }
        
        public async Task Atualizar(OrdemServico ordemServico)
        {
            _contexto.OrdensServicos.Update(ordemServico);
            await _contexto.SaveChangesAsync();
        }
        
        public async Task<OrdemServico> Obter(int osID, bool Ativo)
        {
            return await _contexto.OrdensServicos
                        .Where(os => os.ID == osID)
                        .Where(os => os.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<OrdemServico>> Listar(bool Ativo)
        {
            return await _contexto.OrdensServicos.Where(os => os.Ativo == Ativo).ToListAsync();
        }

        public async Task<IEnumerable<OrdemServico>> ListarPorCliente(int clienteID, bool Ativo)
        {
            return await _contexto.OrdensServicos
                        .Where(os => os.ClienteID == clienteID)
                        .Where(os => os.Ativo == Ativo).ToListAsync();
        }

        public async Task<IEnumerable<OrdemServico>> ListarPorFuncionario(int funcionarioID, bool Ativo)
        {
            return await _contexto.OrdensServicos
                        .Where(os => os.FuncionarioID == funcionarioID)
                        .Where(os => os.Ativo == Ativo).ToListAsync();
        }

        public async Task<IEnumerable<OrdemServico>> ListarPorStatus(int statusID, bool Ativo)
        {
            return await _contexto.OrdensServicos
                        .Where(os => os.StatusOSID == statusID)
                        .Where(os => os.Ativo == Ativo).ToListAsync();
        }

        public async Task<IEnumerable<OrdemPaginado>> Paginar(int pageNumber, int pageSize, int order, string nome, int statusID)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@PageNumber", pageNumber);
            parametros.Add("@PageSize", pageSize);
            parametros.Add("@Order", order);
            parametros.Add("@Nome", nome);
            parametros.Add("@Status", statusID);

            return await _contexto.Database.GetDbConnection().QueryAsync<OrdemPaginado>(
                "spObterOrdensPaginadas",
                parametros,
                commandType: System.Data.CommandType.StoredProcedure
            );
        }
    }
}