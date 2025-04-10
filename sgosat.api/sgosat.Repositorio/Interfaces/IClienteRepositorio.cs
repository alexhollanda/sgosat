using sgosat.Dominio.Entidades;

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
    }
}