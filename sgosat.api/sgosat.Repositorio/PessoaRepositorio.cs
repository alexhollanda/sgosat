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

        public async Task<Pessoa> ObterCliente(int pessoaID, bool Ativo)
        {
            return await _contexto.Pessoas
                        .Where(p => p.ID == pessoaID)
                        .Where(p => p.Cliente == true)
                        .Where(p => p.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<Pessoa> ObterFuncionario(int pessoaID, bool Ativo)
        {
            return await _contexto.Pessoas
                        .Where(p => p.ID == pessoaID)
                        .Where(p => p.Funcionario == true)
                        .Where(p => p.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }
        
        public async Task<Pessoa> ObterPorDoc(string doc, bool Ativo)
        {
            return await _contexto.Pessoas
                        .Where(p => p.Documento == doc)
                        .Where(p => p.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }
        
        public async Task<Pessoa> ObterClientePorDoc(string doc, bool Ativo)
        {
            return await _contexto.Pessoas
                        .Where(p => p.Documento == doc)
                        .Where(p => p.Cliente == true)
                        .Where(p => p.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }
        
        public async Task<Pessoa> ObterFuncionarioPorDoc(string doc, bool Ativo)
        {
            return await _contexto.Pessoas
                        .Where(p => p.Documento == doc)
                        .Where(p => p.Funcionario == true)
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

        public async Task<Pessoa> ObterClientePorEmail(string email, bool Ativo)
        {
            return await _contexto.Pessoas
                        .Where(p => p.Email == email)
                        .Where(p => p.Cliente == true)
                        .Where(p => p.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<Pessoa> ObterFuncionarioPorEmail(string email, bool Ativo)
        {
            return await _contexto.Pessoas
                        .Where(p => p.Email == email)
                        .Where(p => p.Funcionario == true)
                        .Where(p => p.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Pessoa>> Listar(bool Ativo)
        {
            return await _contexto.Pessoas.Where(p => p.Ativo == Ativo).ToListAsync();
        }

        public async Task<IEnumerable<Pessoa>> ListarClientes(bool Ativo)
        {
            return await _contexto.Pessoas
                            .Where(p => p.Cliente == true)
                            .Where(p => p.Ativo == Ativo)
                            .ToListAsync();
        }

        public async Task<IEnumerable<Pessoa>> ListarFuncionarios(bool Ativo)
        {
            return await _contexto.Pessoas
                            .Where(p => p.Funcionario == true)
                            .Where(p => p.Ativo == Ativo)
                            .ToListAsync();
        }
    }
}