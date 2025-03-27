using Microsoft.AspNetCore.Mvc;
using sgosat.Api.Models.Enderecos.Response;
using sgosat.Aplicacao.Interfaces;

namespace sgosat.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CEPController : ControllerBase
    {
        private readonly ICepAplicacao _cepAplicacao;

        public CEPController(ICepAplicacao cepAplicacao)
        {
            _cepAplicacao = cepAplicacao;
        }

        [HttpGet]
        [Route("Consultar/")]
        public async Task<ActionResult> Consultar(int cep)
        {
            try
            {
                var endereco = await _cepAplicacao.ConsultaCEP(cep);

                var enderecoResposta = new EnderecoResposta
                {
                    Logradouro = endereco.Logradouro,
                    Bairro = endereco.Bairro,
                    Cep = endereco.CEP,
                    Cidade = endereco.Cidade,
                    Estado = endereco.UF
                };

                return Ok(enderecoResposta);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 
    }
}