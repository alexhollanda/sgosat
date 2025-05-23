using Dapper;
using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;
using sgosat.Repositorio.Models.Usuarios.Response;

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

        public async Task<Usuario> ObterPorUserName(string userName, bool Ativo)
        {
            return await _contexto.Usuarios
                        .Where(u => u.UserName == userName)
                        .Where(u => u.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<Usuario> ObterPorEmail(string email, bool Ativo)
        {
            return await _contexto.Usuarios
                        .Where(u => u.Email == email)
                        .Where(u => u.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Usuario>> Listar(bool Ativo)
        {
            return await _contexto.Usuarios.Where(u => u.Ativo == Ativo).ToListAsync();
        }

        public async Task<IEnumerable<UsuarioPaginado>> Paginar(int pageNumber, int pageSize, int order, string nome, string userName)
        {         
            var parametros = new DynamicParameters();
            parametros.Add("@PageNumber", pageNumber);
            parametros.Add("@PageSize", pageSize);
            parametros.Add("@Order", order);
            parametros.Add("@Nome", nome);
            parametros.Add("@UserName", userName);

            return await _contexto.Database.GetDbConnection().QueryAsync<UsuarioPaginado>(
                "spObterUsuariosPaginados",
                parametros,
                commandType: System.Data.CommandType.StoredProcedure
            );
        }
    }
}