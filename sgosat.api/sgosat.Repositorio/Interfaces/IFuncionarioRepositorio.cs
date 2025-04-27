using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Models.Funcionarios.Response;

namespace sgosat.Repositorio.Interfaces
{
    public interface IFuncionarioRepositorio
    {
        Task<int> Salvar(Funcionario funcionario);
        Task Atualizar(Funcionario funcionario);
        Task<Funcionario> Obter(int funcionarioID, bool Ativo);
        Task<Funcionario> ObterPorDoc(string doc, bool Ativo);
        Task<IEnumerable<Funcionario>> ObterPorTermo(string query, bool Ativo);
        Task<IEnumerable<Funcionario>> ObterTecnico(bool Ativo);
        Task<IEnumerable<Funcionario>> Listar(bool ativo);
        Task<IEnumerable<FuncionarioPaginado>> Paginar(int pageNumber, int pageSize, int order, string nome, string documento);
    }
}