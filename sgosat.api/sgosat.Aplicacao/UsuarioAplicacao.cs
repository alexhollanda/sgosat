using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;

namespace sgosat.Aplicacao
{
    public class UsuarioAplicacao : IUsuarioAplicacao
    {
        readonly IUsuarioRepositorio _usuarioRepositorio;

        public UsuarioAplicacao(IUsuarioRepositorio usuarioRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
        }

        public async Task<int> Criar(Usuario usuario)
        {
            if (usuario == null)
                throw new Exception("Usuário não pode ser vazio");

            ValidarInformacoesUsuario(usuario);

            if (string.IsNullOrEmpty(usuario.Senha))
                throw new Exception("Senha não pode ser vazia");

            return await _usuarioRepositorio.Salvar(usuario);
        }

        public async Task Atualizar(Usuario usuario)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuario.ID, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");
            
            ValidarInformacoesUsuario(usuario);

            usuarioDominio.UserName = usuario.UserName;

            await _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        public async Task AtualizaSenha(Usuario usuario, string senhaAntiga)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuario.ID, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");
            
            if (usuarioDominio.Senha != senhaAntiga)
                throw new Exception("Senha Antiga Inválida!");

            usuarioDominio.Senha = usuario.Senha;

            await _usuarioRepositorio.Atualizar(usuarioDominio);
        }
        
        public async Task Deletar(int usuarioID)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuarioID, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");
            
            usuarioDominio.Deletar();

            await _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        public async Task Restaurar(int usuarioID)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuarioID, false);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");
            
            usuarioDominio.Restaurar();
            
            await _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        public async Task<Usuario> Obter(int usuarioID)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuarioID, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");

            return usuarioDominio;
        }

        public async Task<Usuario> ObterPorEmail(string email)
        {
            var usuarioDominio = await _usuarioRepositorio.ObterPorEmail(email, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");

            return usuarioDominio;
        }

        public async Task<IEnumerable<Usuario>> Listar(bool Ativo)
        {
            return await _usuarioRepositorio.Listar(Ativo);
        }

        #region Útil

        private static void ValidarInformacoesUsuario(Usuario usuario)
        {
            if (string.IsNullOrEmpty(usuario.UserName))
                throw new Exception("Nome de usuário não pode ser vazio");

            if (string.IsNullOrEmpty(usuario.Pessoa.Email))
                throw new Exception("E-mail não pode ser vazio");
        }

        #endregion
    }
}