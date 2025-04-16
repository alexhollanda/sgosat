using sgosat.Dominio.Entidades;

namespace sgosat.Aplicacao.Interfaces
{
    public interface IOrdemServicoAplicacao
    {
        Task<int> Criar(OrdemServico ordemServico);
        Task Atualizar(OrdemServico ordemServico);
        Task Deletar(int ordemServicoID);
        Task Restaurar(int ordemServicoID);
        Task<OrdemServico> Obter(int ordemServicoID);
        Task<IEnumerable<OrdemServico>> Listar(bool Ativo);
        Task<IEnumerable<OrdemServico>> ListarPorCliente(int clienteID, bool Ativo);
        
        Task<IEnumerable<OrdemServico>> ListarPorFuncionario(int funcionarioID, bool Ativo);
        Task<IEnumerable<OrdemServico>> ListarPorStatus(int statusID, bool Ativo);
    }
}