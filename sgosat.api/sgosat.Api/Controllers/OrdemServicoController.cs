using Microsoft.AspNetCore.Mvc;
using sgosat.Api.Models.OrdensServico.Request;
using sgosat.Api.Models.OrdensServico.Response;
using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;
using sgosat.Dominio.Enumeradores;

namespace sgosat.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdemServicoController : ControllerBase
    {
        private readonly IOrdemServicoAplicacao _osAplicacao;

        public OrdemServicoController(IOrdemServicoAplicacao osAplicacao)
        {
            _osAplicacao = osAplicacao;
        }

        [HttpGet]
        [Route("Obter/{osID}")]
        public async Task<IActionResult> Obter([FromRoute] int osID)
        {
            try
            {
                var osDominio = await _osAplicacao.Obter(osID);

                var osResponse = new OrdemServicoResponse()
                {
                    ID = osDominio.ID,
                    DataAbertura = osDominio.DataAbertura,
                    DataConclusao = osDominio.DataConclusao,
                    ClienteID = osDominio.ClienteID,
                    FuncionarioID = osDominio.FuncionarioID,
                    DescricaoProblema = osDominio.DescricaoProblema,
                    ServicoRealizado = osDominio.ServicoRealizado,
                    Observacoes = osDominio.Observacoes,
                    Valor = osDominio.Valor,
                    StatusOSID = osDominio.StatusOSID
                };

                return Ok(osResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }   
        }

        [HttpPost]
        [Route("Criar")]
        public async Task<ActionResult> Criar([FromBody] OrdemServicoCriar osCriar)
        {
            try
            {
                var osDominio = new OrdemServico()
                {
                    DataAbertura = osCriar.DataAbertura,
                    DataConclusao = osCriar.DataConclusao,
                    ClienteID = osCriar.ClienteID,
                    FuncionarioID = osCriar.FuncionarioID,
                    DescricaoProblema = osCriar.DescricaoProblema,
                    ServicoRealizado = osCriar.ServicoRealizado,
                    Observacoes = osCriar.Observacoes,
                    Valor = osCriar.Valor,
                    StatusOSID = osCriar.StatusOSID
                };

                var osID = await _osAplicacao.Criar(osDominio);
                return Ok(osID);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<ActionResult> Atualizar([FromBody] OrdemServicoAtualizar osAtualizar)
        {
            try
            {
                var osDominio = new OrdemServico()
                {
                    ID = osAtualizar.ID,
                    DataConclusao = osAtualizar.DataConclusao,
                    FuncionarioID = osAtualizar.FuncionarioID,
                    DescricaoProblema = osAtualizar.DescricaoProblema,
                    ServicoRealizado = osAtualizar.ServicoRealizado,
                    Observacoes = osAtualizar.Observacoes,
                    Valor = osAtualizar.Valor,
                    StatusOSID = osAtualizar.StatusOSID
                };

                await _osAplicacao.Atualizar(osDominio);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete]
        [Route("Deletar/{osID}")]
        public async Task<ActionResult> Deletar([FromRoute] int osID)
        {
            try
            {
                await _osAplicacao.Deletar(osID);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Restaurar/{osID}")]
        public async Task<ActionResult> Restaurar([FromRoute] int osID)
        {
            try
            {
                await _osAplicacao.Restaurar(osID);

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
                var osDominio = await _osAplicacao.Listar(ativos);

                var ordens = osDominio.Select(o => new OrdemServicoResponse(){
                    ID = o.ID,
                    DataAbertura = o.DataAbertura,
                    DataConclusao = o.DataConclusao,
                    ClienteID = o.ClienteID,
                    FuncionarioID = o.FuncionarioID,
                    DescricaoProblema = o.DescricaoProblema,
                    ServicoRealizado = o.ServicoRealizado,
                    Observacoes = o.Observacoes,
                    Valor = o.Valor,
                    StatusOSID = o.StatusOSID
                }).ToList();

                return Ok(ordens);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorCliente/{clienteID}")]
        public async Task<ActionResult> ListarPorCliente([FromRoute] int clienteID, [FromQuery] bool ativos)
        {
            try
            {
                var osDominio = await _osAplicacao.ListarPorCliente(clienteID, ativos);

                var ordens = osDominio.Select(o => new OrdemServicoResponse(){
                    ID = o.ID,
                    DataAbertura = o.DataAbertura,
                    DataConclusao = o.DataConclusao,
                    ClienteID = o.ClienteID,
                    FuncionarioID = o.FuncionarioID,
                    DescricaoProblema = o.DescricaoProblema,
                    ServicoRealizado = o.ServicoRealizado,
                    Observacoes = o.Observacoes,
                    Valor = o.Valor,
                    StatusOSID = o.StatusOSID
                }).ToList();

                return Ok(ordens);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorFuncionario/{funcionarioID}")]
        public async Task<ActionResult> ListarPorFuncionario([FromRoute] int funcionarioID, [FromQuery] bool ativos)
        {
            try
            {
                var osDominio = await _osAplicacao.ListarPorFuncionario(funcionarioID, ativos);

                var ordens = osDominio.Select(o => new OrdemServicoResponse(){
                    ID = o.ID,
                    DataAbertura = o.DataAbertura,
                    DataConclusao = o.DataConclusao,
                    ClienteID = o.ClienteID,
                    FuncionarioID = o.FuncionarioID,
                    DescricaoProblema = o.DescricaoProblema,
                    ServicoRealizado = o.ServicoRealizado,
                    Observacoes = o.Observacoes,
                    Valor = o.Valor,
                    StatusOSID = o.StatusOSID
                }).ToList();

                return Ok(ordens);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorStatus/{statusID}")]
        public async Task<ActionResult> ListarPorStatus([FromRoute] int statusID, [FromQuery] bool ativos)
        {
            try
            {
                var osDominio = await _osAplicacao.ListarPorStatus(statusID, ativos);

                var ordens = osDominio.Select(o => new OrdemServicoResponse(){
                    ID = o.ID,
                    DataAbertura = o.DataAbertura,
                    DataConclusao = o.DataConclusao,
                    ClienteID = o.ClienteID,
                    FuncionarioID = o.FuncionarioID,
                    DescricaoProblema = o.DescricaoProblema,
                    ServicoRealizado = o.ServicoRealizado,
                    Observacoes = o.Observacoes,
                    Valor = o.Valor,
                    StatusOSID = o.StatusOSID
                }).ToList();

                return Ok(ordens);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Paginar")]
        public async Task<ActionResult> Paginar(int pageNumber, int pageSize, int order, string nome)
        {
            try
            {
                var osDominio = await _osAplicacao.Paginar(pageNumber, pageSize, order, nome);

                var ordens = osDominio.Select(o => new OrdemPaginado(){
                    ID = o.ID,
                    DataAbertura = o.DataAbertura,
                    Nome = o.Nome,
                    Telefone = o.Telefone,
                    StatusOSID = o.StatusOSID,
                    TotalRegistros = o.TotalRegistros
                }).ToList();

                return Ok(ordens);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("ListarStatusOS")]
        public ActionResult ListarStatusOS()
        {
            try
            {
                List<object> statusOS = new List<object>();
                var idStatusOS = (int[]) Enum.GetValues(typeof(StatusOS));
                var nomeStatusOS = Enum.GetNames(typeof(StatusOS));

                for (int i = 0; i < idStatusOS.Length; i++)
                {
                    statusOS.Add(new{
                        id = idStatusOS[i] + 1,
                        nome = nomeStatusOS[i]
                    });
                }

                return Ok(statusOS);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}