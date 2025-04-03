using sgosat.Dominio.Entidades;

namespace sgosat.Aplicacao.Interfaces
{
    public interface IOrdemServicoPessoasAplicacao
    {
        Task<(int OrdemServicoID, int PessoaID)> Criar(OrdemServicoPessoas ordemServicoPessoas);
        Task Atualizar(OrdemServicoPessoas ordemServicoPessoas);
        Task<OrdemServicoPessoas> Obter(int ordemServicoID);
        Task<OrdemServico> ObterPorCliente(int pessoaID);
        Task<OrdemServico> ObterPorFuncionario(int pessoaID);
    }
}