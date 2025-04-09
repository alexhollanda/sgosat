using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Interfaces
{
    public interface IPessoaRepositorio
    {
        Task<int> Salvar(Pessoa pessoa);
        Task Atualizar(Pessoa pessoa);
        Task<Pessoa> Obter(int pessoaID, bool Ativo);
        Task<Pessoa> ObterCliente(int pessoaID, bool Ativo);
        Task<Pessoa> ObterFuncionario(int pessoaID, bool Ativo);
        Task<Pessoa> ObterPorDoc(string doc, bool Ativo);
        Task<Pessoa> ObterClientePorDoc(string doc, bool Ativo);
        Task<Pessoa> ObterFuncionarioPorDoc(string doc, bool Ativo);
        Task<Pessoa> ObterPorEmail(string email, bool Ativo);
        Task<Pessoa> ObterClientePorEmail(string email, bool Ativo);
        Task<Pessoa> ObterFuncionarioPorEmail(string email, bool Ativo);
        Task<IEnumerable<Pessoa>> ObterPorTermo(string query, bool Ativo);
        Task<IEnumerable<Pessoa>> Listar(bool ativo);
        Task<IEnumerable<Pessoa>> ListarClientes(bool ativo);
        Task<IEnumerable<Pessoa>> ListarFuncionarios(bool ativo);
    }
}