using Microsoft.AspNetCore.Mvc;
using sgosat.Api.Models.Pessoas.Request;
using sgosat.Api.Models.Pessoas.Response;
using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;

namespace sgosat.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PessoaController : ControllerBase
    {
        private readonly IPessoaAplicacao _pessoaAplicacao;

        public PessoaController(IPessoaAplicacao pessoaAplicacao)
        {
            _pessoaAplicacao = pessoaAplicacao;
        }

        [HttpGet]
        [Route("Obter/{pessoaID}")]
        public async Task<ActionResult> Obter([FromRoute] int pessoaID)
        {
            try
            {
                var pessoaDominio = await _pessoaAplicacao.Obter(pessoaID);

                var pessoaResponse = new PessoaResponse()
                {
                    ID = pessoaDominio.ID,
                    Nome = pessoaDominio.Nome,
                    TipoPessoa = pessoaDominio.TipoPessoa,
                    Documento = pessoaDominio.Documento,
                    Telefone = pessoaDominio.Telefone,
                    Email = pessoaDominio.Email,
                    CEP = pessoaDominio.CEP,
                    Logradouro = pessoaDominio.Logradouro,
                    Numero = pessoaDominio.Numero,
                    Complemento = pessoaDominio.Complemento,
                    Bairro = pessoaDominio.Bairro,
                    Cidade = pessoaDominio.Cidade,
                    UF = pessoaDominio.UF,
                    Cliente = pessoaDominio.Cliente,
                    Funcionario = pessoaDominio.Funcionario
                };

                return Ok(pessoaResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterCliente/{pessoaID}")]
        public async Task<ActionResult> ObterCliente([FromRoute] int pessoaID)
        {
            try
            {
                var pessoaDominio = await _pessoaAplicacao.ObterCliente(pessoaID);

                var pessoaResponse = new PessoaResponse()
                {
                    ID = pessoaDominio.ID,
                    Nome = pessoaDominio.Nome,
                    TipoPessoa = pessoaDominio.TipoPessoa,
                    Documento = pessoaDominio.Documento,
                    Telefone = pessoaDominio.Telefone,
                    Email = pessoaDominio.Email,
                    CEP = pessoaDominio.CEP,
                    Logradouro = pessoaDominio.Logradouro,
                    Numero = pessoaDominio.Numero,
                    Complemento = pessoaDominio.Complemento,
                    Bairro = pessoaDominio.Bairro,
                    Cidade = pessoaDominio.Cidade,
                    UF = pessoaDominio.UF,
                    Cliente = pessoaDominio.Cliente,
                    Funcionario = pessoaDominio.Funcionario
                };

                return Ok(pessoaResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterFuncionario/{pessoaID}")]
        public async Task<ActionResult> ObterFuncionario([FromRoute] int pessoaID)
        {
            try
            {
                var pessoaDominio = await _pessoaAplicacao.ObterFuncionario(pessoaID);

                var pessoaResponse = new PessoaResponse()
                {
                    ID = pessoaDominio.ID,
                    Nome = pessoaDominio.Nome,
                    TipoPessoa = pessoaDominio.TipoPessoa,
                    Documento = pessoaDominio.Documento,
                    Telefone = pessoaDominio.Telefone,
                    Email = pessoaDominio.Email,
                    CEP = pessoaDominio.CEP,
                    Logradouro = pessoaDominio.Logradouro,
                    Numero = pessoaDominio.Numero,
                    Complemento = pessoaDominio.Complemento,
                    Bairro = pessoaDominio.Bairro,
                    Cidade = pessoaDominio.Cidade,
                    UF = pessoaDominio.UF,
                    Cliente = pessoaDominio.Cliente,
                    Funcionario = pessoaDominio.Funcionario
                };

                return Ok(pessoaResponse);
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
                var pessoaDominio = await _pessoaAplicacao.ObterPorDoc(doc);

                var pessoaResponse = new PessoaResponse()
                {
                    ID = pessoaDominio.ID,
                    Nome = pessoaDominio.Nome,
                    TipoPessoa = pessoaDominio.TipoPessoa,
                    Documento = pessoaDominio.Documento,
                    Telefone = pessoaDominio.Telefone,
                    Email = pessoaDominio.Email,
                    CEP = pessoaDominio.CEP,
                    Logradouro = pessoaDominio.Logradouro,
                    Numero = pessoaDominio.Numero,
                    Complemento = pessoaDominio.Complemento,
                    Bairro = pessoaDominio.Bairro,
                    Cidade = pessoaDominio.Cidade,
                    UF = pessoaDominio.UF,
                    Cliente = pessoaDominio.Cliente,
                    Funcionario = pessoaDominio.Funcionario
                };

                return Ok(pessoaResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterClientePorDoc/{doc}")]
        public async Task<ActionResult> ObterClientePorDoc([FromRoute] string doc)
        {
            try
            {
                var pessoaDominio = await _pessoaAplicacao.ObterClientePorDoc(doc);

                var pessoaResponse = new PessoaResponse()
                {
                    ID = pessoaDominio.ID,
                    Nome = pessoaDominio.Nome,
                    TipoPessoa = pessoaDominio.TipoPessoa,
                    Documento = pessoaDominio.Documento,
                    Telefone = pessoaDominio.Telefone,
                    Email = pessoaDominio.Email,
                    CEP = pessoaDominio.CEP,
                    Logradouro = pessoaDominio.Logradouro,
                    Numero = pessoaDominio.Numero,
                    Complemento = pessoaDominio.Complemento,
                    Bairro = pessoaDominio.Bairro,
                    Cidade = pessoaDominio.Cidade,
                    UF = pessoaDominio.UF,
                    Cliente = pessoaDominio.Cliente,
                    Funcionario = pessoaDominio.Funcionario
                };

                return Ok(pessoaResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterFuncionarioPorDoc/{doc}")]
        public async Task<ActionResult> ObterFuncionariPorDoc([FromRoute] string doc)
        {
            try
            {
                var pessoaDominio = await _pessoaAplicacao.ObterFuncionarioPorDoc(doc);

                var pessoaResponse = new PessoaResponse()
                {
                    ID = pessoaDominio.ID,
                    Nome = pessoaDominio.Nome,
                    TipoPessoa = pessoaDominio.TipoPessoa,
                    Documento = pessoaDominio.Documento,
                    Telefone = pessoaDominio.Telefone,
                    Email = pessoaDominio.Email,
                    CEP = pessoaDominio.CEP,
                    Logradouro = pessoaDominio.Logradouro,
                    Numero = pessoaDominio.Numero,
                    Complemento = pessoaDominio.Complemento,
                    Bairro = pessoaDominio.Bairro,
                    Cidade = pessoaDominio.Cidade,
                    UF = pessoaDominio.UF,
                    Cliente = pessoaDominio.Cliente,
                    Funcionario = pessoaDominio.Funcionario
                };

                return Ok(pessoaResponse);
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
                var pessoaDominio = await _pessoaAplicacao.ObterPorEmail(email);

                var pessoaResponse = new PessoaResponse()
                {
                    ID = pessoaDominio.ID,
                    Nome = pessoaDominio.Nome,
                    TipoPessoa = pessoaDominio.TipoPessoa,
                    Documento = pessoaDominio.Documento,
                    Telefone = pessoaDominio.Telefone,
                    Email = pessoaDominio.Email,
                    CEP = pessoaDominio.CEP,
                    Logradouro = pessoaDominio.Logradouro,
                    Numero = pessoaDominio.Numero,
                    Complemento = pessoaDominio.Complemento,
                    Bairro = pessoaDominio.Bairro,
                    Cidade = pessoaDominio.Cidade,
                    UF = pessoaDominio.UF,
                    Cliente = pessoaDominio.Cliente,
                    Funcionario = pessoaDominio.Funcionario
                };

                return Ok(pessoaResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterClientePorEmail/{email}")]
        public async Task<ActionResult> ObterClientePorEmail([FromRoute] string email)
        {
            try
            {
                var pessoaDominio = await _pessoaAplicacao.ObterClientePorEmail(email);

                var pessoaResponse = new PessoaResponse()
                {
                    ID = pessoaDominio.ID,
                    Nome = pessoaDominio.Nome,
                    TipoPessoa = pessoaDominio.TipoPessoa,
                    Documento = pessoaDominio.Documento,
                    Telefone = pessoaDominio.Telefone,
                    Email = pessoaDominio.Email,
                    CEP = pessoaDominio.CEP,
                    Logradouro = pessoaDominio.Logradouro,
                    Numero = pessoaDominio.Numero,
                    Complemento = pessoaDominio.Complemento,
                    Bairro = pessoaDominio.Bairro,
                    Cidade = pessoaDominio.Cidade,
                    UF = pessoaDominio.UF,
                    Cliente = pessoaDominio.Cliente,
                    Funcionario = pessoaDominio.Funcionario
                };

                return Ok(pessoaResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObterFuncionarioPorEmail/{email}")]
        public async Task<ActionResult> ObterFuncionarioPorEmail([FromRoute] string email)
        {
            try
            {
                var pessoaDominio = await _pessoaAplicacao.ObterFuncionarioPorEmail(email);

                var pessoaResponse = new PessoaResponse()
                {
                    ID = pessoaDominio.ID,
                    Nome = pessoaDominio.Nome,
                    TipoPessoa = pessoaDominio.TipoPessoa,
                    Documento = pessoaDominio.Documento,
                    Telefone = pessoaDominio.Telefone,
                    Email = pessoaDominio.Email,
                    CEP = pessoaDominio.CEP,
                    Logradouro = pessoaDominio.Logradouro,
                    Numero = pessoaDominio.Numero,
                    Complemento = pessoaDominio.Complemento,
                    Bairro = pessoaDominio.Bairro,
                    Cidade = pessoaDominio.Cidade,
                    UF = pessoaDominio.UF,
                    Cliente = pessoaDominio.Cliente,
                    Funcionario = pessoaDominio.Funcionario
                };

                return Ok(pessoaResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Criar")]
        public async Task<IActionResult> Criar([FromBody] PessoaCriar pessoaCriar)
        {
            try
            {
                var pessoaDominio = new Pessoa()
                {
                    Nome = pessoaCriar.Nome,
                    TipoPessoa = pessoaCriar.TipoPessoa,
                    Documento = pessoaCriar.Documento,
                    Telefone = pessoaCriar.Telefone,
                    Email = pessoaCriar.Email,
                    CEP = pessoaCriar.CEP,
                    Logradouro = pessoaCriar.Logradouro,
                    Numero = pessoaCriar.Numero,
                    Complemento = pessoaCriar.Complemento,
                    Bairro = pessoaCriar.Bairro,
                    Cidade = pessoaCriar.Cidade,
                    UF = pessoaCriar.UF,
                    Cliente = pessoaCriar.Cliente,
                    Funcionario = pessoaCriar.Funcionario
                };

                var pessoaID = await _pessoaAplicacao.Criar(pessoaDominio);

                return Ok(pessoaID);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<IActionResult> Atualizar([FromBody] PessoaAtualizar pessoaAtualizar)
        {
            try
            {
                var pessoaDominio = new Pessoa()
                {
                    ID = pessoaAtualizar.ID,
                    Nome = pessoaAtualizar.Nome,
                    Telefone = pessoaAtualizar.Telefone,
                    Email = pessoaAtualizar.Email,
                    CEP = pessoaAtualizar.CEP,
                    Logradouro = pessoaAtualizar.Logradouro,
                    Numero = pessoaAtualizar.Numero,
                    Complemento = pessoaAtualizar.Complemento,
                    Bairro = pessoaAtualizar.Bairro,
                    Cidade = pessoaAtualizar.Cidade,
                    UF = pessoaAtualizar.UF,
                    Cliente = pessoaAtualizar.Cliente,
                    Funcionario = pessoaAtualizar.Funcionario
                };

                await _pessoaAplicacao.Atualizar(pessoaDominio);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("Deletar/{pessoaID}")]
        public async Task<ActionResult> Deletar([FromRoute] int pessoaID)
        {
            try
            {
                await _pessoaAplicacao.Deletar(pessoaID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("DeletarCliente/{pessoaID}")]
        public async Task<ActionResult> DeletarCliente([FromRoute] int pessoaID)
        {
            try
            {
                await _pessoaAplicacao.DeletarCliente(pessoaID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("DeletarFuncionario/{pessoaID}")]
        public async Task<ActionResult> DeletarFuncionario([FromRoute] int pessoaID)
        {
            try
            {
                await _pessoaAplicacao.DeletarFuncionario(pessoaID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Restaurar/{pessoaID}")]
        public async Task<ActionResult> Restaurar([FromRoute] int pessoaID)
        {
            try
            {
                await _pessoaAplicacao.Restaurar(pessoaID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("RestaurarCliente/{pessoaID}")]
        public async Task<ActionResult> RestaurarCliente([FromRoute] int pessoaID)
        {
            try
            {
                await _pessoaAplicacao.RestaurarCliente(pessoaID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("RestaurarFuncionario/{pessoaID}")]
        public async Task<ActionResult> RestaurarFuncionario([FromRoute] int pessoaID)
        {
            try
            {
                await _pessoaAplicacao.RestaurarFuncionario(pessoaID);

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
                var pessoaDominio = await _pessoaAplicacao.Listar(ativos);

                var pessoas = pessoaDominio.Select(p => new PessoaResponse(){
                    ID = p.ID,
                    Nome = p.Nome,
                    TipoPessoa = p.TipoPessoa,
                    Documento = p.Documento,
                    Telefone = p.Telefone,
                    Email = p.Email,
                    CEP = p.CEP,
                    Logradouro = p.Logradouro,
                    Numero = p.Numero,
                    Complemento = p.Complemento,
                    Bairro = p.Bairro,
                    Cidade = p.Cidade,
                    UF = p.UF,
                    Cliente = p.Cliente,
                    Funcionario = p.Funcionario
                }).ToList();

                return Ok(pessoas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarClientes")]
        public async Task<ActionResult> ListarClientes([FromQuery] bool ativos)
        {
            try
            {
                var pessoaDominio = await _pessoaAplicacao.ListarClientes(ativos);

                var pessoas = pessoaDominio.Select(p => new PessoaResponse(){
                    ID = p.ID,
                    Nome = p.Nome,
                    TipoPessoa = p.TipoPessoa,
                    Documento = p.Documento,
                    Telefone = p.Telefone,
                    Email = p.Email,
                    CEP = p.CEP,
                    Logradouro = p.Logradouro,
                    Numero = p.Numero,
                    Complemento = p.Complemento,
                    Bairro = p.Bairro,
                    Cidade = p.Cidade,
                    UF = p.UF,
                    Cliente = p.Cliente,
                    Funcionario = p.Funcionario
                }).ToList();

                return Ok(pessoas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarFuncionarios")]
        public async Task<ActionResult> ListarFuncionarios([FromQuery] bool ativos)
        {
            try
            {
                var pessoaDominio = await _pessoaAplicacao.ListarFuncionarios(ativos);

                var pessoas = pessoaDominio.Select(p => new PessoaResponse(){
                    ID = p.ID,
                    Nome = p.Nome,
                    TipoPessoa = p.TipoPessoa,
                    Documento = p.Documento,
                    Telefone = p.Telefone,
                    Email = p.Email,
                    CEP = p.CEP,
                    Logradouro = p.Logradouro,
                    Numero = p.Numero,
                    Complemento = p.Complemento,
                    Bairro = p.Bairro,
                    Cidade = p.Cidade,
                    UF = p.UF,
                    Cliente = p.Cliente,
                    Funcionario = p.Funcionario
                }).ToList();

                return Ok(pessoas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}