using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Interfaces
{
    public interface IUsuarioRepositorio
    {
        Task<int> Salvar(Usuario usuario);
        Task Atualizar(Usuario usuario);
        Task<Usuario> Obter(int usuarioID, bool Ativo);
        Task<Usuario> ObterPorEmail(string email, bool Ativo);
        Task<IEnumerable<Usuario>> Listar(bool ativo);
    }
}