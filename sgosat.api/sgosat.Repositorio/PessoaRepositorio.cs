using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;

namespace sgosat.Repositorio
{
    public class PessoaRepositorio : BaseRepositorio, IPessoaRepositorio
    {
        public PessoaRepositorio(sgosatContexto contexto) : base(contexto)
        {
            
        }

        public async Task<int> Salvar(Pessoa pessoa)
        {
            _contexto.Pessoas.Add(pessoa);
            await _contexto.SaveChangesAsync();

            return pessoa.ID;
        }

        public async Task Atualizar(Pessoa pessoa)
        {
            _contexto.Pessoas.Update(pessoa);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Pessoa> Obter(int pessoaID, bool Ativo)
        {
            return await _contexto.Pessoas
                        .Where(p => p.ID == pessoaID)
                        .Where(p => p.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<Pessoa> ObterPorEmail(string email, bool Ativo)
        {
            return await _contexto.Pessoas
                        .Where(p => p.Email == email)
                        .Where(p => p.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Pessoa>> Listar(bool Ativo)
        {
            return await _contexto.Pessoas.Where(p => p.Ativo == Ativo).ToListAsync();
        }
    }
}