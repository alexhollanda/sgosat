using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Models.Funcionarios.Response;

namespace sgosat.Aplicacao.Interfaces
{
    public interface IFuncionarioAplicacao
    {
        Task<int> Criar(Funcionario funcionario);
        Task Atualizar(Funcionario funcionario);        
        Task Deletar(int funcionarioID);
        Task Restaurar(int funcionarioID);
        Task<Funcionario> Obter(int funcionarioID);
        Task<Funcionario> ObterPorDoc(string doc);
        public Task<IEnumerable<Funcionario>> ObterPorTermo(string query, bool Ativo);
        public Task<IEnumerable<Funcionario>> ObterTecnico(bool Ativo);
        public Task<IEnumerable<Funcionario>> Listar(bool Ativo); 
        public Task<IEnumerable<FuncionarioPaginado>> Paginar(int pageNumber, int pageSize, int order, string nome, string documento);
    }
}