using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;
using sgosat.Repositorio.Models.Ordens.Response;

namespace sgosat.Aplicacao
{
    public class OrdemServicoAplicacao : IOrdemServicoAplicacao
    {
        readonly IOrdemServicoRepositorio _ordemServicoRepositorio;

        public OrdemServicoAplicacao(IOrdemServicoRepositorio ordemServicoRepositorio)
        {
            _ordemServicoRepositorio = ordemServicoRepositorio;
        }

        public async Task<int> Criar(OrdemServico ordemServico)
        {
            if (ordemServico == null)
                throw new Exception("Ordem de Serviço não pode ser vazia!");
            
            return await _ordemServicoRepositorio.Salvar(ordemServico);            

        }

        public async Task Atualizar(OrdemServico ordemServico)
        {
            var ordemServicoDominio = await _ordemServicoRepositorio.Obter(ordemServico.ID, true);
            if (ordemServicoDominio == null)
                throw new Exception("Ordem de Serviço não encontrada!");

            ordemServicoDominio.DataConclusao = ordemServico.DataConclusao;
            ordemServicoDominio.DescricaoProblema = ordemServico.DescricaoProblema;
            ordemServicoDominio.ServicoRealizado = ordemServico.ServicoRealizado;
            ordemServicoDominio.Observacoes = ordemServico.Observacoes;
            ordemServicoDominio.Valor = ordemServico.Valor;
            ordemServicoDominio.StatusOSID = ordemServico.StatusOSID;

            await _ordemServicoRepositorio.Atualizar(ordemServicoDominio);
        }

        public async Task Deletar(int ordemServicoID)
        {
            var ordemServicoDominio = await _ordemServicoRepositorio.Obter(ordemServicoID, true);

            if (ordemServicoDominio == null)
                throw new Exception("Ordem de Serviço não encontrada!");

            ordemServicoDominio.Deletar();

            await _ordemServicoRepositorio.Atualizar(ordemServicoDominio);
        }

        public async Task Restaurar(int ordemServicoID)
        {
            var ordemServicoDominio = await _ordemServicoRepositorio.Obter(ordemServicoID, false);

            if (ordemServicoDominio == null)
                throw new Exception("Ordem de Serviço não encontrada!");

            ordemServicoDominio.Restaurar();

            await _ordemServicoRepositorio.Atualizar(ordemServicoDominio);
        }
        
        public async Task<OrdemServico> Obter(int ordemServicoID)
        {
            var ordemServicoDominio = await _ordemServicoRepositorio.Obter(ordemServicoID, true);

             if (ordemServicoDominio == null)
                throw new Exception("Ordem de Serviço não encontrada!");

            return ordemServicoDominio;
        }
        
        public async Task<IEnumerable<OrdemServico>> Listar(bool Ativo)
        {
            return await _ordemServicoRepositorio.Listar(Ativo);
        }
        
        public async Task<IEnumerable<OrdemServico>> ListarPorCliente(int clienteID, bool Ativo)
        {
            return await _ordemServicoRepositorio.ListarPorCliente(clienteID, Ativo);
        }
        
        public async Task<IEnumerable<OrdemServico>> ListarPorFuncionario(int funcionarioID, bool Ativo)
        {
            return await _ordemServicoRepositorio.ListarPorFuncionario(funcionarioID, Ativo);
        }
        
        public async Task<IEnumerable<OrdemServico>> ListarPorStatus(int statusID, bool Ativo)
        {
            return await _ordemServicoRepositorio.ListarPorStatus(statusID, Ativo); 
        }

        public async Task<IEnumerable<OrdemPaginado>> Paginar(int pageNumber, int pageSize, int order, string nome)
        {
            return await _ordemServicoRepositorio.Paginar(pageNumber, pageSize, order, nome); 
        }

        #region Útil

        private static void ValidarInformacoesOrdemServico(OrdemServico ordemServico)
        {
            if (ordemServico.DataAbertura < DateTime.Today)
                throw new Exception("A data de abertura não pode ser no passado");

            if (string.IsNullOrEmpty(ordemServico.DescricaoProblema))
                throw new Exception("Descrição do problema não pode ser vazia");
        }

        #endregion
    }
}