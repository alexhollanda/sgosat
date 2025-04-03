using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;

namespace sgosat.Repositorio
{
    public class OrdemServicoRepositorio : BaseRepositorio, IOrdemServicoRepositorio
    {
        public OrdemServicoRepositorio(sgosatContexto contexto) : base(contexto)
        {
            
        }

        public async Task<int> Salvar(OrdemServico ordemServico)
        {
            _contexto.OrdensServicos.Add(ordemServico);
            await _contexto.SaveChangesAsync();

            return ordemServico.ID;
        }
        
        public async Task Atualizar(OrdemServico ordemServico)
        {
            _contexto.OrdensServicos.Update(ordemServico);
            await _contexto.SaveChangesAsync();
        }
        
        public async Task<OrdemServico> Obter(int osID, bool Ativo)
        {
            return await _contexto.OrdensServicos
                        .Where(os => os.ID == osID)
                        .Where(os => os.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<OrdemServico>> Listar(bool Ativo)
        {
            return await _contexto.OrdensServicos.Where(os => os.Ativo == Ativo).ToListAsync();
        }
        public async Task<IEnumerable<OrdemServico>> ListarPorStatus(int statusID, bool Ativo)
        {
            return await _contexto.OrdensServicos
                        .Where(os => os.StatusOSID == statusID)
                        .Where(os => os.Ativo == Ativo).ToListAsync();
        }
    }
}