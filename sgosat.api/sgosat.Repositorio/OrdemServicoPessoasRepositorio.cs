using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;

namespace sgosat.Repositorio
{
    public class OrdemServicoPessoasRepositorio : BaseRepositorio, IOrdemServicoPessoasRepositorio
    {
        public OrdemServicoPessoasRepositorio(sgosatContexto contexto) : base(contexto)
        {
            
        }

        public async Task<(int OrdemServicoID, int PessoaID)> Salvar(OrdemServicoPessoas ordemServicoPessoas)
        {
            _contexto.OrdemServicoPessoas.Add(ordemServicoPessoas);
            await _contexto.SaveChangesAsync();

            return (ordemServicoPessoas.OrdemServicoID, ordemServicoPessoas.PessoaID);
        }

        public async Task Atualizar(OrdemServicoPessoas ordemServicoPessoas)
        {
            _contexto.OrdemServicoPessoas.Update(ordemServicoPessoas);
            await _contexto.SaveChangesAsync();
        }

        public async Task<IEnumerable<OrdemServicoPessoas>> Listar(int ordemServicoID)
        {
            return await _contexto.OrdemServicoPessoas
                            .Where(ops => ops.OrdemServicoID == ordemServicoID)
                            .ToListAsync();
        }

        public async Task<IEnumerable<OrdemServico>> ListarPorCliente(int ordemServicoID)
        {
            return await _contexto.OrdemServicoPessoas
                        .Where(osp => osp.Funcao == "C")
                        .Include(osp => osp.OrdemServico)
                        .Select(osp => osp.OrdemServico)
                        .ToListAsync();
        }
        
        public async Task<IEnumerable<OrdemServico>> ListarPorFuncionario(int ordemServicoID)
        {
            return await _contexto.OrdemServicoPessoas
                        .Where(osp => osp.Funcao == "F")
                        .Include(osp => osp.OrdemServico)
                        .Select(osp => osp.OrdemServico)
                        .ToListAsync();
        }
    }
}