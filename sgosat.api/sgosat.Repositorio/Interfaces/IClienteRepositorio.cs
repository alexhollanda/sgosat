using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Models.Clientes.Response;

namespace sgosat.Repositorio.Interfaces
{
    public interface IClienteRepositorio
    {
        Task<int> Salvar(Cliente cliente);
        Task Atualizar(Cliente cliente);
        Task<Cliente> Obter(int clienteID, bool Ativo);
        Task<Cliente> ObterPorDoc(string doc, bool Ativo);
        Task<IEnumerable<Cliente>> ObterPorTermo(string query, bool Ativo);
        Task<IEnumerable<Cliente>> Listar(bool ativo);
        Task<IEnumerable<ClientePaginado>> Paginar(int pageNumber, int pageSize, int order, string nome, string documento);
    }
}