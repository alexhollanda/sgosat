using sgosat.Dominio.Entidades;

namespace sgosat.Aplicacao.Interfaces
{
    public interface IPessoaAplicacao
    {
        Task<int> Criar(Pessoa pessoa);
        Task Atualizar(Pessoa pessoa);        
        Task Deletar(int pessoaID);
        Task DeletarCliente(int pessoaID);
        Task DeletarFuncionario(int pessoaID);
        Task Restaurar(int pessoaID);
        Task RestaurarCliente(int pessoaID);
        Task RestaurarFuncionario(int pessoaID);
        Task<Pessoa> Obter(int pessoaID);
        Task<Pessoa> ObterCliente(int pessoaID);
        Task<Pessoa> ObterFuncionario(int pessoaID);
        Task<Pessoa> ObterPorDoc(string doc);
        Task<Pessoa> ObterClientePorDoc(string doc);
        Task<Pessoa> ObterFuncionarioPorDoc(string doc);
        Task<Pessoa> ObterPorEmail(string email);
        Task<Pessoa> ObterClientePorEmail(string email);
        Task<Pessoa> ObterFuncionarioPorEmail(string email);
        public Task<IEnumerable<Pessoa>> ObterPorTermo(string query, bool Ativo);
        public Task<IEnumerable<Pessoa>> Listar(bool Ativo);   
        public Task<IEnumerable<Pessoa>> ListarClientes(bool Ativo);   
        public Task<IEnumerable<Pessoa>> ListarFuncionarios(bool Ativo);   
    }
}