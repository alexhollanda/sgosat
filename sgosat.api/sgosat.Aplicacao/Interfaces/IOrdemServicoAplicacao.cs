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
        Task<OrdemServico> Listar(bool Ativo);
        Task<OrdemServico> ListarPorStatus(int statusID, bool Ativo);
    }
}