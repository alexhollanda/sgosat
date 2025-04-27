using Dapper;
using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;
using sgosat.Repositorio.Models.Funcionarios.Response;

namespace sgosat.Repositorio
{
    public class FuncionarioRepositorio : BaseRepositorio, IFuncionarioRepositorio
    {
        public FuncionarioRepositorio(sgosatContexto contexto) : base(contexto)
        {

        }

        public async Task<int> Salvar(Funcionario funcionario)
        {
            _contexto.Funcionarios.Add(funcionario);
            await _contexto.SaveChangesAsync();

            return funcionario.ID;
        }

        public async Task Atualizar(Funcionario funcionario)
        {
            _contexto.Funcionarios.Update(funcionario);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Funcionario> Obter(int funcionarioID, bool Ativo)
        {
            return await _contexto.Funcionarios
                        .Where(f => f.ID == funcionarioID)
                        .Where(f => f.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<Funcionario> ObterPorDoc(string doc, bool Ativo)
        {
            return await _contexto.Funcionarios
                        .Where(f => f.Documento == doc)
                        .Where(f => f.Ativo == Ativo)
                        .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Funcionario>> ObterPorTermo(string query, bool Ativo)
        {
            return await _contexto.Funcionarios
                        .Where(f => f.Nome.Contains(query) || f.Documento.Contains(query))
                        .Where(f => f.Ativo == Ativo)
                        .Take(10)
                        .ToListAsync();
        }

        public async Task<IEnumerable<Funcionario>> ObterTecnico(bool Ativo)
        {
            return await _contexto.Funcionarios
                        .Where(f => f.TipoFuncionarioID == 3 || f.TipoFuncionarioID == 5)
                        .Where(f => f.Ativo == Ativo)
                        .ToListAsync();
        }

        public async Task<IEnumerable<Funcionario>> Listar(bool Ativo)
        {
            return await _contexto.Funcionarios.Where(f => f.Ativo == Ativo)
                                                .Where(f => f.ID != 1)
                                                .ToListAsync();
        }

        public async Task<IEnumerable<FuncionarioPaginado>> Paginar(int pageNumber, int pageSize, int order, string nome, string documento)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@PageNumber", pageNumber);
            parametros.Add("@PageSize", pageSize);
            parametros.Add("@Order", order);
            parametros.Add("@Nome", nome);
            parametros.Add("@Documento", documento);

            return await _contexto.Database.GetDbConnection().QueryAsync<FuncionarioPaginado>(
                "spObterFuncionariosPaginados",
                parametros,
                commandType: System.Data.CommandType.StoredProcedure
            );
        }
    }
}