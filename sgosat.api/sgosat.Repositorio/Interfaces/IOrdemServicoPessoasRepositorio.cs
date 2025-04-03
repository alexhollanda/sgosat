using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Interfaces
{
    public interface IOrdemServicoPessoasRepositorio
    {
        Task<(int OrdemServicoID, int PessoaID)> Salvar(OrdemServicoPessoas ordemServicoPessoas);
        Task Atualizar(OrdemServicoPessoas ordemServicoPessoas);
        Task<IEnumerable<OrdemServicoPessoas>> Listar(int ordemServicoID);
        Task<IEnumerable<OrdemServico>> ListarPorCliente(int ordemServicoID);
        Task<IEnumerable<OrdemServico>> ListarPorFuncionario(int ordemServicoID);
    }
}