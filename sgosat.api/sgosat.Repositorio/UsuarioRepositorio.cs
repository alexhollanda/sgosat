using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio
{
    public class UsuarioRepositorio : BaseRepositorio, IUsuarioRepositorio
    {
        public UsuarioRepositorio(sgosatContexto contexto) : base(contexto)
        {
            
        }

        public int Salvar(Usuario usuario)
        {
            _contexto.Usuarios.Add(usuario);
            _contexto.SaveChanges();

            return usuario.ID;
        }

        public void Atualizar(Usuario usuario)
        {
            _contexto.Usuarios.Update(usuario);
            _contexto.SaveChanges();
        }

        public Usuario Obter(int usuarioID)
        {
            return _contexto.Usuarios.Where(u => u.ID == usuarioID).FirstOrDefault();
        }

        public Usuario ObterPorEmail(string email)
        {
            return _contexto.Usuarios.Where(u => u.Pessoa.Email == email).FirstOrDefault();
        }

        public IEnumerable<Usuario> Listar(bool Ativo)
        {
            return _contexto.Usuarios.Where(u => u.Ativo == Ativo).ToList();
        }
    }
}