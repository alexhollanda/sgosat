using System.Runtime.CompilerServices;
using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;

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
            
            var user = new Usuario
            {
                UserName = usuario.UserName,
                Email = usuario.Email,
                Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha),
                FuncionarioID = usuario.FuncionarioID,
                TipoUsuarioID = usuario.TipoUsuarioID
            };

            return await _usuarioRepositorio.Salvar(user);
        }

        public async Task Atualizar(Usuario usuario)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuario.ID, true);
            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");

            var usuarioUserName = await _usuarioRepositorio.ObterPorUserName(usuario.UserName, true);
            if (usuarioUserName.ID != usuario.ID)
                throw new Exception("Já existe um usuário cadastrado com o Nome de Usuário informado!");
            
            var usuarioEmail = await _usuarioRepositorio.ObterPorEmail(usuario.Email, true);
            if (usuarioEmail.ID != usuario.ID)
                throw new Exception("Já existe um usuário cadastrado com o E-mail informado!");

            if (!String.IsNullOrEmpty(usuario.UserName) && !String.IsNullOrWhiteSpace(usuario.UserName))
                usuarioDominio.UserName = usuario.UserName;
            
            if (!String.IsNullOrEmpty(usuario.Email) && !String.IsNullOrWhiteSpace(usuario.Email))
                usuarioDominio.Email = usuario.Email;

            usuarioDominio.TipoUsuarioID = usuario.TipoUsuarioID;

            await _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        public async Task AtualizaSenha(Usuario usuario, string senhaAntiga)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuario.ID, true);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado!");

            if (usuarioDominio.Senha != senhaAntiga)
                throw new Exception("Senha Antiga Inválida!");

            usuarioDominio.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);

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

        public async Task<Usuario> ObterPorUserName(string userName)
        {
            var usuarioDominio = await _usuarioRepositorio.ObterPorUserName(userName, true);

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

        public async Task<bool> Login(string userName, string senha)
        {
            var usuario = await _usuarioRepositorio.ObterPorUserName(userName, true);
            if (usuario == null)
                return false;

            bool senhaValida = BCrypt.Net.BCrypt.Verify(senha, usuario.Senha);
            

            return senhaValida;
        }

        #region Útil

        private static void ValidarInformacoesUsuario(Usuario usuario)
        {
            if (string.IsNullOrEmpty(usuario.UserName))
                throw new Exception("Nome de usuário não pode ser vazio");

            if (string.IsNullOrEmpty(usuario.Email))
                throw new Exception("E-mail não pode ser vazio");
        }

        #endregion
    }
}