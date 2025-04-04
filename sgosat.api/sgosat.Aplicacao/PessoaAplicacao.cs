using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;

namespace sgosat.Aplicacao
{
    public class PessoaAplicacao : IPessoaAplicacao
    {
        readonly IPessoaRepositorio _pessoaRepositorio;

        public PessoaAplicacao(IPessoaRepositorio pessoaRepositorio)
        {
            _pessoaRepositorio = pessoaRepositorio;
        }

        public async Task<int> Criar(Pessoa pessoa)
        {
            if (pessoa == null)
                throw new Exception("Pessoa não pode ser vazio");

            ValidarInformacoesPessoa(pessoa);

            return await _pessoaRepositorio.Salvar(pessoa);
        }

        public async Task Atualizar(Pessoa pessoa)
        {
            var pessoaDominio = await _pessoaRepositorio.Obter(pessoa.ID, true);

            if (pessoaDominio == null)
                throw new Exception("Pessoa não encontrada!");
            
            ValidarInformacoesPessoa(pessoa);

            var pessoaCompare = await _pessoaRepositorio.ObterPorEmail(pessoa.Email, true);
            if (pessoaCompare.ID != pessoa.ID)
                throw new Exception("Já existe uma pessoa cadastrada com o E-mail informado!");

            pessoaDominio.Nome = pessoa.Nome;
            pessoaDominio.Telefone = pessoa.Telefone;
            pessoaDominio.Email = pessoa.Email;
            pessoaDominio.CEP = pessoa.CEP;
            pessoaDominio.Logradouro = pessoa.Logradouro;
            pessoaDominio.Numero = pessoa.Numero;
            pessoaDominio.Complemento = pessoa.Complemento;
            pessoaDominio.Bairro = pessoa.Bairro;
            pessoaDominio.Cidade = pessoa.Cidade;
            pessoaDominio.UF = pessoa.UF;

            await _pessoaRepositorio.Atualizar(pessoaDominio);
        }
        
        
        public async Task Deletar(int pessoaID)
        {
            var pessoaDominio = await _pessoaRepositorio.Obter(pessoaID, true);

            if (pessoaDominio == null)
                throw new Exception("Pessoa não encontrada!");
            
            pessoaDominio.Deletar();
            
            await _pessoaRepositorio.Atualizar(pessoaDominio);
        }
                
        public async Task DeletarCliente(int pessoaID)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterCliente(pessoaID, true);

            if (pessoaDominio == null)
                throw new Exception("Cliente não encontrada!");
            
            pessoaDominio.Cliente = false;
            
            await _pessoaRepositorio.Atualizar(pessoaDominio);
        }
                
        public async Task DeletarFuncionario(int pessoaID)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterFuncionario(pessoaID, true);

            if (pessoaDominio == null)
                throw new Exception("Funcionário não encontrado!");
            
            pessoaDominio.Funcionario = false;
            
            await _pessoaRepositorio.Atualizar(pessoaDominio);
        }

        public async Task Restaurar(int pessoaID)
        {
            var pessoaDominio = await _pessoaRepositorio.Obter(pessoaID, false);

            if (pessoaDominio == null)
                throw new Exception("Pessoa não encontrada!");
            
            pessoaDominio.Restaurar();
            
            await _pessoaRepositorio.Atualizar(pessoaDominio);
        }

        public async Task RestaurarCliente(int pessoaID)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterCliente(pessoaID, false);

            if (pessoaDominio == null)
                throw new Exception("Cliente não encontrado!");
            
            pessoaDominio.Cliente = true;
            
            await _pessoaRepositorio.Atualizar(pessoaDominio);
        }

        public async Task RestaurarFuncionario(int pessoaID)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterFuncionario(pessoaID, false);

            if (pessoaDominio == null)
                throw new Exception("Funcionário não encontrado!");
            
            pessoaDominio.Funcionario = true;
            
            await _pessoaRepositorio.Atualizar(pessoaDominio);
        }

        public async Task<Pessoa> Obter(int pessoaID)
        {
            var pessoaDominio = await _pessoaRepositorio.Obter(pessoaID, true);

            if (pessoaDominio == null)
                throw new Exception("Pessoa não encontrada!");

            return pessoaDominio;
        }

        public async Task<Pessoa> ObterCliente(int pessoaID)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterCliente(pessoaID, true);

            if (pessoaDominio == null)
                throw new Exception("Cliente não encontrado!");

            return pessoaDominio;
        }

        public async Task<Pessoa> ObterFuncionario(int pessoaID)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterFuncionario(pessoaID, true);

            if (pessoaDominio == null)
                throw new Exception("Funcionário não encontrado!");

            return pessoaDominio;
        }

        public async Task<Pessoa> ObterPorDoc(string doc)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterPorDoc(doc, true);

            if (pessoaDominio == null)
                throw new Exception("Pessoa não encontrada!");

            return pessoaDominio;
        }

        public async Task<Pessoa> ObterClientePorDoc(string doc)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterClientePorDoc(doc, true);

            if (pessoaDominio == null)
                throw new Exception("Pessoa não encontrada!");

            return pessoaDominio;
        }

        public async Task<Pessoa> ObterFuncionarioPorDoc(string doc)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterFuncionarioPorDoc(doc, true);

            if (pessoaDominio == null)
                throw new Exception("Pessoa não encontrada!");

            return pessoaDominio;
        }

        public async Task<Pessoa> ObterPorEmail(string email)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterPorEmail(email, true);

            if (pessoaDominio == null)
                throw new Exception("Pessoa não encontrada!");

            return pessoaDominio;
        }

        public async Task<Pessoa> ObterClientePorEmail(string email)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterClientePorEmail(email, true);

            if (pessoaDominio == null)
                throw new Exception("Cliente não encontrado!");

            return pessoaDominio;
        }

        public async Task<Pessoa> ObterFuncionarioPorEmail(string email)
        {
            var pessoaDominio = await _pessoaRepositorio.ObterFuncionarioPorEmail(email, true);

            if (pessoaDominio == null)
                throw new Exception("Funcionário não encontrado!");

            return pessoaDominio;
        }

        public async Task<IEnumerable<Pessoa>> Listar(bool Ativo)
        {
            return await _pessoaRepositorio.Listar(Ativo);
        }

        public async Task<IEnumerable<Pessoa>> ListarClientes(bool Ativo)
        {
            return await _pessoaRepositorio.ListarClientes(Ativo);
        }

        public async Task<IEnumerable<Pessoa>> ListarFuncionarios(bool Ativo)
        {
            return await _pessoaRepositorio.ListarFuncionarios(Ativo);
        }

        #region Útil

        private static void ValidarInformacoesPessoa(Pessoa pessoa)
        {
            if (string.IsNullOrEmpty(pessoa.Nome))
                throw new Exception("Nome não pode ser vazio");

            if (string.IsNullOrEmpty(pessoa.TipoPessoa))
                throw new Exception("Selecione o Tipo de Pessoa");

            if (string.IsNullOrEmpty(pessoa.Documento))
                throw new Exception("Digite um número de documento válido!");

            if (string.IsNullOrEmpty(pessoa.Telefone))
                throw new Exception("Telefone não pode ser vazio!");

            if (string.IsNullOrEmpty(pessoa.Email))
                throw new Exception("E-mail não pode ser vazio!");

            if (string.IsNullOrEmpty(pessoa.CEP))
                throw new Exception("CEP não pode ser vazio!");

            if (string.IsNullOrEmpty(pessoa.Logradouro))
                throw new Exception("Endereço não pode ser vazio!");

            if (string.IsNullOrEmpty(pessoa.Numero))
                throw new Exception("Número não pode ser vazio!");

            if (string.IsNullOrEmpty(pessoa.Bairro))
                throw new Exception("Bairro não pode ser vazio!");

            if (string.IsNullOrEmpty(pessoa.Cidade))
                throw new Exception("Cidade não pode ser vazio!");
                
            if (string.IsNullOrEmpty(pessoa.UF))
                throw new Exception("UF não pode ser vazio!");
        }

        #endregion
    }
}