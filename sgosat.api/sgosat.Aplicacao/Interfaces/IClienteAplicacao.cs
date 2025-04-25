using sgosat.Dominio.Entidades;

namespace sgosat.Aplicacao.Interfaces
{
    public interface IClienteAplicacao
    {
        Task<int> Criar(Cliente cliente);
        Task Atualizar(Cliente cliente);        
        Task Deletar(int clienteID);
        Task Restaurar(int clienteID);
        Task<Cliente> Obter(int clienteID);
        Task<Cliente> ObterPorDoc(string doc);
        public Task<IEnumerable<Cliente>> ObterPorTermo(string query, bool Ativo);
        public Task<IEnumerable<Cliente>> Listar(bool Ativo); 
        public Task<IEnumerable<Cliente>> Paginar(int pageNumber, int pageSize, int order); 
    }
}