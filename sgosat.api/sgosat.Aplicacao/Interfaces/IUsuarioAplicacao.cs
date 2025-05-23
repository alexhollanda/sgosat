using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Models.Usuarios.Response;

namespace sgosat.Aplicacao.Interfaces
{
    public interface IUsuarioAplicacao
    {
        Task<int> Criar(Usuario usuario);
        Task Atualizar(Usuario usuario);
        Task AtualizaSenha(Usuario usuario, string senhaAntiga);      
        Task Deletar(int usuarioID);
        Task Restaurar(int usuarioID);
        Task<Usuario> Obter(int usuarioID);
        Task<Usuario> ObterPorUserName(string userName);
        Task<Usuario> ObterPorEmail(string email);
        public Task<IEnumerable<Usuario>> Listar(bool Ativo);
        public Task<bool> Login(string userName, string senha);
        public Task<IEnumerable<UsuarioPaginado>> Paginar(int pageNumber, int pageSize, int order, string nome, string userName);
    }
}