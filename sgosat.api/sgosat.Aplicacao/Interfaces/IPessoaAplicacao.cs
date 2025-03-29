using sgosat.Dominio.Entidades;

namespace sgosat.Aplicacao.Interfaces
{
    public interface IPessoaAplicacao
    {
        Task<int> Criar(Pessoa pessoa);
        Task Atualizar(Pessoa pessoa);        
        Task Deletar(int pessoaID);
        Task Restaurar(int pessoaID);
        Task<Pessoa> Obter(int pessoaID);
        Task<Pessoa> ObterPorEmail(string email);
        public Task<IEnumerable<Pessoa>> Listar(bool Ativo);   
    }
}