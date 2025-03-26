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

        public int Criar(Usuario usuario)
        {
            if (usuario == null)
                throw new Exception("Usuário não pode ser vazio");

            ValidarInformacoesUsuario(usuario);

            if (string.IsNullOrEmpty(usuario.Senha))
                throw new Exception("Senha não pode ser vazia");

            return _usuarioRepositorio.Salvar(usuario);
        }

        public void Atualizar(Usuario usuario)
        {
            var usuarioDominio = _usuarioRepositorio.Obter(usuario.ID, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");
            
            ValidarInformacoesUsuario(usuario);

            usuarioDominio.UserName = usuario.UserName;

            _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        public void AtualizaSenha(Usuario usuario, string senhaAntiga)
        {
            var usuarioDominio = _usuarioRepositorio.Obter(usuario.ID, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");
            
            if (usuarioDominio.Senha != senhaAntiga)
                throw new Exception("Senha Antiga Inválida!");

            usuarioDominio.Senha = usuario.Senha;

            _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        public Usuario Obter(int usuarioID)
        {
            var usuarioDominio = _usuarioRepositorio.Obter(usuarioID, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");

            return usuarioDominio;
        }

        public Usuario ObterPorEmail(string email)
        {
            var usuarioDominio = _usuarioRepositorio.ObterPorEmail(email, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");

            return usuarioDominio;
        }
        
        public void Deletar(int usuarioID)
        {
            var usuarioDominio = _usuarioRepositorio.Obter(usuarioID, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");
            
            usuarioDominio.Deletar();

            _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        public void Restaurar(int usuarioID)
        {
            var usuarioDominio = _usuarioRepositorio.Obter(usuarioID, false);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");
            
            usuarioDominio.Restaurar();
            
            _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        public IEnumerable<Usuario> Listar(bool Ativo)
        {
            return _usuarioRepositorio.Listar(Ativo);
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