using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Interfaces
{
    public interface IPessoaRepositorio
    {
        Task<int> Salvar(Pessoa pessoa);
        Task Atualizar(Pessoa pessoa);
        Task<Pessoa> Obter(int pessoaID, bool Ativo);
        Task<Pessoa> ObterPorEmail(string email, bool Ativo);
        Task<IEnumerable<Pessoa>> Listar(bool ativo);
    }
}