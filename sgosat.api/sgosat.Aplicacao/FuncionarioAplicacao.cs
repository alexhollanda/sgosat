using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;

namespace sgosat.Aplicacao
{
    public class FuncionarioAplicacao : IFuncionarioAplicacao
    {
        readonly IFuncionarioRepositorio _funcionarioRepositorio;

        public FuncionarioAplicacao(IFuncionarioRepositorio funcionarioRepositorio)
        {
            _funcionarioRepositorio = funcionarioRepositorio;
        }

        public async Task<int> Criar(Funcionario funcionario)
        {
            if (funcionario == null)
                throw new Exception("Funcionário não pode ser vazio");

            ValidarInformacoesFuncionario(funcionario);
            

            if (string.IsNullOrEmpty(funcionario.Documento))
                throw new Exception("Digite um número de documento válido!");

            return await _funcionarioRepositorio.Salvar(funcionario);
        }

        public async Task Atualizar(Funcionario funcionario)
        {
            var funcionarioDominio = await _funcionarioRepositorio.Obter(funcionario.ID, true);

            if (funcionarioDominio == null)
                throw new Exception("Funcionário não encontrado!");

            ValidarInformacoesFuncionario(funcionario);

            funcionarioDominio.Nome = funcionario.Nome;
            funcionarioDominio.Telefone = funcionario.Telefone;
            funcionarioDominio.Salario = funcionario.Salario;
            funcionarioDominio.TipoFuncionarioID = funcionario.TipoFuncionarioID;

            await _funcionarioRepositorio.Atualizar(funcionarioDominio);
        }


        public async Task Deletar(int funcionarioID)
        {
            var funcionarioDominio = await _funcionarioRepositorio.Obter(funcionarioID, true);

            if (funcionarioDominio == null)
                throw new Exception("Funcionário não encontrado!");

            funcionarioDominio.Deletar();

            await _funcionarioRepositorio.Atualizar(funcionarioDominio);
        }

        public async Task Restaurar(int funcionarioID)
        {
            var funcionarioDominio = await _funcionarioRepositorio.Obter(funcionarioID, false);

            if (funcionarioDominio == null)
                throw new Exception("Cliente não encontrado!");

            funcionarioDominio.Restaurar();

            await _funcionarioRepositorio.Atualizar(funcionarioDominio);
        }

        public async Task<Funcionario> Obter(int funcionarioID)
        {
            var funcionarioDominio = await _funcionarioRepositorio.Obter(funcionarioID, true);

            if (funcionarioDominio == null)
                throw new Exception("Funcionário não encontrado!");

            return funcionarioDominio;
        }

        public async Task<Funcionario> ObterPorDoc(string doc)
        {
            var funcionarioDominio = await _funcionarioRepositorio.ObterPorDoc(doc, true);

            if (funcionarioDominio == null)
                throw new Exception("Funcionário não encontrado!");

            return funcionarioDominio;
        }

        public async Task<IEnumerable<Funcionario>> ObterPorTermo(string query, bool Ativo)
        {
            return await _funcionarioRepositorio.ObterPorTermo(query, Ativo);
        }

        public async Task<IEnumerable<Funcionario>> ObterTecnico(bool Ativo)
        {
            return await _funcionarioRepositorio.ObterTecnico(Ativo);
        }

        public async Task<IEnumerable<Funcionario>> Listar(bool Ativo)
        {
            return await _funcionarioRepositorio.Listar(Ativo);
        }

        #region Útil

        private static void ValidarInformacoesFuncionario(Funcionario funcionario)
        {
            if (string.IsNullOrEmpty(funcionario.Nome))
                throw new Exception("Nome não pode ser vazio");

            if (string.IsNullOrEmpty(funcionario.Telefone))
                throw new Exception("Telefone não pode ser vazio!");

            if (funcionario.Salario <= 0)
                throw new Exception("Informe um valor válido para o salário");
        }

        #endregion
    }
}