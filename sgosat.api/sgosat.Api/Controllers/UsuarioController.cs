using Microsoft.AspNetCore.Mvc;
using sgosat.Api.Models.Usuario.Request;
using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;

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

        [HttpPost]
        [Route("Criar")]
        public ActionResult Criar([FromBody] UsuarioCriar usuarioCriar)
        {
            try
            {
                var usuarioDomino = new Usuario()
                {
                    UserName = usuarioCriar.UserName,
                    Senha = usuarioCriar.Senha,
                    Pessoa = usuarioCriar.Pessoa
                };

                var usuarioID = _usuarioAplicacao.Criar(usuarioDomino);
                return Ok(usuarioID);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}