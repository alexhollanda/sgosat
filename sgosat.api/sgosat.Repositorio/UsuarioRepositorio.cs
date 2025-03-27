using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio
{
    public class UsuarioRepositorio : BaseRepositorio, IUsuarioRepositorio
    {
        public UsuarioRepositorio(sgosatContexto contexto) : base(contexto)
        {
            
        }

        public async Task<int> Salvar(Usuario usuario)
        {
            _contexto.Usuarios.Add(usuario);
            await _contexto.SaveChangesAsync();

            return usuario.ID;
        }

        public async Task Atualizar(Usuario usuario)
        {
            _contexto.Usuarios.Update(usuario);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Usuario> Obter(int usuarioID, bool Ativo)
        {
            return await _contexto.Usuarios
                        .Where(u => u.ID == usuarioID)
                        .Where(u => u.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<Usuario> ObterPorEmail(string email, bool Ativo)
        {
            return await _contexto.Usuarios
                        .Where(u => u.Pessoa.Email == email)
                        .Where(u => u.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Usuario>> Listar(bool Ativo)
        {
            return await _contexto.Usuarios.Where(u => u.Ativo == Ativo).ToListAsync();
        }
    }
}