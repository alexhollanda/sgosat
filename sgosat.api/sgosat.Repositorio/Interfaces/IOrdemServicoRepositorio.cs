using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Models.Ordens.Response;

namespace sgosat.Repositorio.Interfaces
{
    public interface IOrdemServicoRepositorio
    {
        Task<int> Salvar(OrdemServico ordemServico);
        Task Atualizar(OrdemServico ordemServico);
        Task<OrdemServico> Obter(int osID, bool Ativo);
        Task<IEnumerable<OrdemServico>> Listar(bool Ativo);
        Task<IEnumerable<OrdemServico>> ListarPorCliente(int clienteID, bool Ativo);
        Task<IEnumerable<OrdemServico>> ListarPorFuncionario(int funcionarioID, bool Ativo);
        Task<IEnumerable<OrdemServico>> ListarPorStatus(int statusID, bool Ativo);
        Task<IEnumerable<OrdemPaginado>> Paginar(int pageNumber, int pageSize, int order, string nome);
    }
}