using Microsoft.AspNetCore.Mvc;
using sgosat.Api.Models.Funcionarios.Request;
using sgosat.Api.Models.Funcionarios.Response;
using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;

namespace sgosat.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FuncionarioController : ControllerBase
    {
        private readonly IFuncionarioAplicacao _funcionarioAplicacao;

        public FuncionarioController(IFuncionarioAplicacao funcionarioAplicacao)
        {
            _funcionarioAplicacao = funcionarioAplicacao;
        }

        [HttpGet]
        [Route("Obter/{funcionarioID}")]
        public async Task<ActionResult> Obter([FromRoute] int funcionarioID)
        {
            try
            {
                var funcionarioDominio = await _funcionarioAplicacao.Obter(funcionarioID);

                var funcionarioResponse = new FuncionarioResponse()
                {
                    ID = funcionarioDominio.ID,
                    Nome = funcionarioDominio.Nome,
                    Documento = funcionarioDominio.Documento,
                    Telefone = funcionarioDominio.Telefone,
                    Salario = funcionarioDominio.Salario,
                    TipoFuncionarioID = funcionarioDominio.TipoFuncionarioID
                };

                return Ok(funcionarioResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterPorDoc/{doc}")]
        public async Task<ActionResult> ObterPorDoc([FromRoute] string doc)
        {
            try
            {
                var funcionarioDominio = await _funcionarioAplicacao.ObterPorDoc(doc);

                var funcionarioResponse = new FuncionarioResponse()
                {
                    ID = funcionarioDominio.ID,
                    Nome = funcionarioDominio.Nome,
                    Documento = funcionarioDominio.Documento,
                    Telefone = funcionarioDominio.Telefone,
                    Salario = funcionarioDominio.Salario,
                    TipoFuncionarioID = funcionarioDominio.TipoFuncionarioID
                };

                return Ok(funcionarioResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterPorTermo")]
        public async Task<ActionResult> ObterPorTermo([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Termo de busca não pode ser vazio.");
            
            var funcionarios = await _funcionarioAplicacao.ObterPorTermo(query, true);

            return Ok(funcionarios);
        }

        [HttpPost]
        [Route("Criar")]
        public async Task<IActionResult> Criar([FromBody] FuncionarioCriar funcionarioCriar)
        {
            try
            {
                var funcionarioDominio = new Funcionario()
                {
                    Nome = funcionarioCriar.Nome,
                    Documento = funcionarioCriar.Documento,
                    Telefone = funcionarioCriar.Telefone,
                    Salario = funcionarioCriar.Salario,
                    TipoFuncionarioID = funcionarioCriar.TipoFuncionarioID
                };

                var funcionarioID = await _funcionarioAplicacao.Criar(funcionarioDominio);

                return Ok(funcionarioID);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<IActionResult> Atualizar([FromBody] FuncionarioAtualizar funcionarioAtualizar)
        {
            try
            {
                var funcionarioDominio = new Funcionario()
                {
                    ID = funcionarioAtualizar.ID,
                    Nome = funcionarioAtualizar.Nome,
                    Telefone = funcionarioAtualizar.Telefone,
                    Salario = funcionarioAtualizar.Salario,
                    TipoFuncionarioID = funcionarioAtualizar.TipoFuncionarioID
                };

                await _funcionarioAplicacao.Atualizar(funcionarioDominio);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("Deletar/{funcionarioID}")]
        public async Task<ActionResult> Deletar([FromRoute] int funcionarioID)
        {
            try
            {
                await _funcionarioAplicacao.Deletar(funcionarioID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Restaurar/{funcionarioID}")]
        public async Task<ActionResult> Restaurar([FromRoute] int funcionarioID)
        {
            try
            {
                await _funcionarioAplicacao.Restaurar(funcionarioID);

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
                var funcionarioDominio = await _funcionarioAplicacao.Listar(ativos);

                var funcionarios = funcionarioDominio.Select(f => new FuncionarioResponse(){
                    ID = f.ID,
                    Nome = f.Nome,
                    Documento = f.Documento,
                    Telefone = f.Telefone,
                    Salario = f.Salario,
                    TipoFuncionarioID = f.TipoFuncionarioID
                }).ToList();

                return Ok(funcionarios);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }       
    }
}