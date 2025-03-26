using sgosat.Dominio.Entidades;

public interface IUsuarioRepositorio
{
    int Salvar(Usuario usuario);
    void Atualizar(Usuario usuario);
    Usuario Obter(int usuarioID, bool Ativo);
    Usuario ObterPorEmail(string email, bool Ativo);
    IEnumerable<Usuario> Listar(bool ativo);
}