using Microsoft.AspNetCore.Mvc;
using sgosat.Api.Models.Clientes.Request;
using sgosat.Api.Models.Clientes.Response;
using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;

namespace sgosat.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly IClienteAplicacao _clienteAplicacao;

        public ClienteController(IClienteAplicacao clienteAplicacao)
        {
            _clienteAplicacao = clienteAplicacao;
        }

        [HttpGet]
        [Route("Obter/{clienteID}")]
        public async Task<ActionResult> Obter([FromRoute] int clienteID)
        {
            try
            {
                var clienteDominio = await _clienteAplicacao.Obter(clienteID);

                var clienteResponse = new ClienteResponse()
                {
                    ID = clienteDominio.ID,
                    Nome = clienteDominio.Nome,
                    TipoPessoa = clienteDominio.TipoPessoa,
                    Documento = clienteDominio.Documento,
                    Telefone = clienteDominio.Telefone,
                    CEP = clienteDominio.CEP,
                    Logradouro = clienteDominio.Logradouro,
                    Numero = clienteDominio.Numero,
                    Complemento = clienteDominio.Complemento,
                    Bairro = clienteDominio.Bairro,
                    Cidade = clienteDominio.Cidade,
                    UF = clienteDominio.UF,
                };

                return Ok(clienteResponse);
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
                var clienteDominio = await _clienteAplicacao.ObterPorDoc(doc);

                var clienteResponse = new ClienteResponse()
                {
                    ID = clienteDominio.ID,
                    Nome = clienteDominio.Nome,
                    TipoPessoa = clienteDominio.TipoPessoa,
                    Documento = clienteDominio.Documento,
                    Telefone = clienteDominio.Telefone,
                    CEP = clienteDominio.CEP,
                    Logradouro = clienteDominio.Logradouro,
                    Numero = clienteDominio.Numero,
                    Complemento = clienteDominio.Complemento,
                    Bairro = clienteDominio.Bairro,
                    Cidade = clienteDominio.Cidade,
                    UF = clienteDominio.UF
                };

                return Ok(clienteResponse);
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
            
            var clientes = await _clienteAplicacao.ObterPorTermo(query, true);

            return Ok(clientes);
        }

        [HttpPost]
        [Route("Criar")]
        public async Task<IActionResult> Criar([FromBody] ClienteCriar clienteCriar)
        {
            try
            {
                var clienteDominio = new Cliente()
                {
                    Nome = clienteCriar.Nome,
                    TipoPessoa = clienteCriar.TipoPessoa,
                    Documento = clienteCriar.Documento,
                    Telefone = clienteCriar.Telefone,
                    CEP = clienteCriar.CEP,
                    Logradouro = clienteCriar.Logradouro,
                    Numero = clienteCriar.Numero,
                    Complemento = clienteCriar.Complemento,
                    Bairro = clienteCriar.Bairro,
                    Cidade = clienteCriar.Cidade,
                    UF = clienteCriar.UF
                };

                var clienteID = await _clienteAplicacao.Criar(clienteDominio);

                return Ok(clienteID);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<IActionResult> Atualizar([FromBody] ClienteAtualizar clienteAtualizar)
        {
            try
            {
                var clienteDominio = new Cliente()
                {
                    ID = clienteAtualizar.ID,
                    Nome = clienteAtualizar.Nome,
                    Telefone = clienteAtualizar.Telefone,
                    CEP = clienteAtualizar.CEP,
                    Logradouro = clienteAtualizar.Logradouro,
                    Numero = clienteAtualizar.Numero,
                    Complemento = clienteAtualizar.Complemento,
                    Bairro = clienteAtualizar.Bairro,
                    Cidade = clienteAtualizar.Cidade,
                    UF = clienteAtualizar.UF
                };

                await _clienteAplicacao.Atualizar(clienteDominio);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("Deletar/{clienteID}")]
        public async Task<ActionResult> Deletar([FromRoute] int clienteID)
        {
            try
            {
                await _clienteAplicacao.Deletar(clienteID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Restaurar/{pessoaID}")]
        public async Task<ActionResult> Restaurar([FromRoute] int clienteID)
        {
            try
            {
                await _clienteAplicacao.Restaurar(clienteID);

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
                var clienteDominio = await _clienteAplicacao.Listar(ativos);

                var clientes = clienteDominio.Select(c => new ClienteResponse(){
                    ID = c.ID,
                    Nome = c.Nome,
                    TipoPessoa = c.TipoPessoa,
                    Documento = c.Documento,
                    Telefone = c.Telefone,
                    CEP = c.CEP,
                    Logradouro = c.Logradouro,
                    Numero = c.Numero,
                    Complemento = c.Complemento,
                    Bairro = c.Bairro,
                    Cidade = c.Cidade,
                    UF = c.UF
                }).ToList();

                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }       

    }
}