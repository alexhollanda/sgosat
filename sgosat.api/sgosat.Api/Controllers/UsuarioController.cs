using Microsoft.AspNetCore.Mvc;
using sgosat.Api.Models.Usuarios.Request;
using sgosat.Api.Models.Usuarios.Response;
using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;
using sgosat.Dominio.Enumeradores;

namespace sgosat.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioAplicacao _usuarioAplicacao;

        public UsuarioController(IUsuarioAplicacao usuarioAplicacao)
        {
            _usuarioAplicacao = usuarioAplicacao;
        }

        [HttpGet]
        [Route("Obter/{usuarioID}")]
        public async Task<ActionResult> Obter([FromRoute] int usuarioID)
        {
            try
            {
                var usuarioDomino = await _usuarioAplicacao.Obter(usuarioID);

                var usuarioResponse = new UsuarioResponse()
                {
                    ID = usuarioDomino.ID,
                    UserName = usuarioDomino.UserName,
                    Email = usuarioDomino.Email,
                    FuncionarioID = usuarioDomino.FuncionarioID,
                    TipoUsuarioID = usuarioDomino.TipoUsuarioID
                };

                return Ok(usuarioResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterPorUserName/{userName}")]
        public async Task<ActionResult> ObterPorUserName([FromRoute] string userName)
        {
            try
            {
                var usuarioDomino = await _usuarioAplicacao.ObterPorUserName(userName);

                var usuarioResponse = new UsuarioResponse()
                {
                    ID = usuarioDomino.ID,
                    UserName = usuarioDomino.UserName,
                    Email = usuarioDomino.Email,
                    FuncionarioID = usuarioDomino.FuncionarioID,
                    TipoUsuarioID = usuarioDomino.TipoUsuarioID
                };

                return Ok(usuarioResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterPorEmail/{email}")]
        public async Task<ActionResult> ObterPorEmail([FromRoute] string email)
        {
            try
            {
                var usuarioDomino = await _usuarioAplicacao.ObterPorEmail(email);

                var usuarioResponse = new UsuarioResponse()
                {
                    ID = usuarioDomino.ID,
                    UserName = usuarioDomino.UserName,
                    Email = usuarioDomino.Email,
                    FuncionarioID = usuarioDomino.FuncionarioID,
                    TipoUsuarioID = usuarioDomino.TipoUsuarioID
                };

                return Ok(usuarioResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<ActionResult> Login([FromBody] UsuarioLogin usuario)
        {                      
            bool autenticado = await _usuarioAplicacao.Login(usuario.UserName, usuario.Senha);

            if (!autenticado)
                return Unauthorized(new {mensagem = "Nome de Usuário ou Senha inválidos!"});
            
            return Ok(new {mensagem = "Login efetuado com sucesso!"});
        }

        [HttpPost]
        [Route("Criar")]
        public async Task<ActionResult> Criar([FromBody] Usuario usuarioCriar)
        {
            try
            {
                var usuarioID = await _usuarioAplicacao.Criar(usuarioCriar);
                return Ok(usuarioID);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<ActionResult> Atualizar([FromBody] UsuarioAtualizar usuario)
        {
            try
            {
                var usuarioDomino = new Usuario()
                {
                    ID = usuario.ID,
                    UserName = usuario.UserName,
                    Email = usuario.Email,
                    TipoUsuarioID = usuario.TipoUsuarioID
                };

                await _usuarioAplicacao.Atualizar(usuarioDomino);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("AlterarSenha")]
        public async Task<ActionResult> AlterarSenha([FromBody] UsuarioAlterarSenha usuario)
        {
            try
            {
                var usuarioDomino = new Usuario()
                {
                    ID = usuario.ID,
                    Senha = usuario.Senha
                };

                await _usuarioAplicacao.AtualizaSenha(usuarioDomino, usuario.SenhaAntiga);

                return Ok("Senha alterada com sucesso!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpDelete]
        [Route("Deletar/{usuarioID}")]
        public async Task<ActionResult> Deletar([FromRoute] int usuarioID)
        {
            try
            {
                await _usuarioAplicacao.Deletar(usuarioID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Restaurar/{usuarioID}")]
        public async Task<ActionResult> Restaurar([FromRoute] int usuarioID)
        {
            try
            {
                await _usuarioAplicacao.Restaurar(usuarioID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Listar")]
        public async Task<ActionResult> Listar([FromQuery] bool ativos)
        {
            try
            {
                var usuarioDomino = await _usuarioAplicacao.Listar(ativos);

                var usuarios = usuarioDomino.Select(u => new UsuarioResponse(){
                    ID = u.ID,
                    UserName = u.UserName,
                    Email = u.Email,
                    FuncionarioID = u.FuncionarioID,
                    TipoUsuarioID = u.TipoUsuarioID
                }).ToList();

                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Paginar")]
        public async Task<ActionResult> Paginar(int pageNumber, int pageSize, int order, string nome = null, string userName = null)
        {
            try
            {
                var usuariosDominio = await _usuarioAplicacao.Paginar(pageNumber, pageSize, order, nome, userName);

                var usuarios = usuariosDominio.Select(u => new UsuarioPaginado(){
                    ID = u.ID,
                    Nome = u.Nome,
                    UserName = u.UserName,
                    Email = u.Email,
                    TotalRegistros = u.TotalRegistros
                }).ToList();

                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }    
    
        [HttpGet]
        [Route("ListarTiposUsuarios")]
        public ActionResult ListarTiposUsuario()
        {
            try
            {
                List<object> tiposUsuarios = new List<object>();
                var idTiposUsuarios = (int[]) Enum.GetValues(typeof(TiposUsuarios));
                var nomeTiposUsuarios = Enum.GetNames(typeof(TiposUsuarios));

                for (int i = 0; i < idTiposUsuarios.Length; i++)
                {
                    tiposUsuarios.Add(new{
                        id = idTiposUsuarios[i] + 1,
                        nome = nomeTiposUsuarios[i]
                    });
                }

                return Ok(tiposUsuarios);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}