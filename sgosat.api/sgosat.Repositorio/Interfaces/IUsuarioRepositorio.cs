using sgosat.Dominio.Entidades;

public interface IUsuarioRepositorio
{
    int Salvar(Usuario usuario);
    void Atualizar(Usuario usuario);
    Usuario Obter(int usuarioID);
    Usuario ObterPorEmail(string email);
    IEnumerable<Usuario> Listar(bool ativo);
}