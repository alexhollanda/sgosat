using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Models.Usuarios.Response;

namespace sgosat.Repositorio.Interfaces
{
    public interface IUsuarioRepositorio
    {
        Task<int> Salvar(Usuario usuario);
        Task Atualizar(Usuario usuario);
        Task<Usuario> Obter(int usuarioID, bool Ativo);
        Task<Usuario> ObterPorUserName(string userName, bool Ativo);
        Task<Usuario> ObterPorEmail(string email, bool Ativo);
        Task<IEnumerable<Usuario>> Listar(bool ativo);
        Task<IEnumerable<UsuarioPaginado>> Paginar(int pageNumber, int pageSize, int order, string nome, string userName);
    }
}