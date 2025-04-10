using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Interfaces;

namespace sgosat.Aplicacao
{
    public class ClienteAplicacao : IClienteAplicacao
    {
        readonly IClienteRepositorio _clienteRepositorio;

        public ClienteAplicacao(IClienteRepositorio clienteRepositorio)
        {
            _clienteRepositorio = clienteRepositorio;
        }

        public async Task<int> Criar(Cliente cliente)
        {
            if (cliente == null)
                throw new Exception("Cliente não pode ser vazio");

            ValidarInformacoesCliente(cliente);

            return await _clienteRepositorio.Salvar(cliente);
        }

        public async Task Atualizar(Cliente cliente)
        {
            var clienteDominio = await _clienteRepositorio.Obter(cliente.ID, true);

            if (clienteDominio == null)
                throw new Exception("Cliente não encontrado!");

            ValidarInformacoesCliente(cliente);

            clienteDominio.Nome = cliente.Nome;
            clienteDominio.Telefone = cliente.Telefone;
            clienteDominio.CEP = cliente.CEP;
            clienteDominio.Logradouro = cliente.Logradouro;
            clienteDominio.Numero = cliente.Numero;
            clienteDominio.Complemento = cliente.Complemento;
            clienteDominio.Bairro = cliente.Bairro;
            clienteDominio.Cidade = cliente.Cidade;
            clienteDominio.UF = cliente.UF;

            await _clienteRepositorio.Atualizar(clienteDominio);
        }


        public async Task Deletar(int clienteID)
        {
            var clienteDominio = await _clienteRepositorio.Obter(clienteID, true);

            if (clienteDominio == null)
                throw new Exception("Cliente não encontrado!");

            clienteDominio.Deletar();

            await _clienteRepositorio.Atualizar(clienteDominio);
        }

        public async Task Restaurar(int clienteID)
        {
            var clienteDominio = await _clienteRepositorio.Obter(clienteID, true);

            if (clienteDominio == null)
                throw new Exception("Cliente não encontrado!");

            clienteDominio.Restaurar();

            await _clienteRepositorio.Atualizar(clienteDominio);
        }

        public async Task<Cliente> Obter(int clienteID)
        {
            var clienteDominio = await _clienteRepositorio.Obter(clienteID, true);

            if (clienteDominio == null)
                throw new Exception("Cliente não encontrado!");

            return clienteDominio;
        }

        public async Task<Cliente> ObterPorDoc(string doc)
        {
            var clienteDominio = await _clienteRepositorio.ObterPorDoc(doc, true);

            if (clienteDominio == null)
                throw new Exception("Cliente não encontrado!");

            return clienteDominio;
        }

        public async Task<IEnumerable<Cliente>> ObterPorTermo(string query, bool Ativo)
        {
            return await _clienteRepositorio.ObterPorTermo(query, Ativo);
        }

        public async Task<IEnumerable<Cliente>> Listar(bool Ativo)
        {
            return await _clienteRepositorio.Listar(Ativo);
        }

        #region Útil

        private static void ValidarInformacoesCliente(Cliente cliente)
        {
            if (string.IsNullOrEmpty(cliente.Nome))
                throw new Exception("Nome não pode ser vazio");

            if (string.IsNullOrEmpty(cliente.TipoPessoa))
                throw new Exception("Selecione o Tipo de Pessoa");

            if (string.IsNullOrEmpty(cliente.Documento))
                throw new Exception("Digite um número de documento válido!");

            if (string.IsNullOrEmpty(cliente.Telefone))
                throw new Exception("Telefone não pode ser vazio!");

            if (string.IsNullOrEmpty(cliente.CEP))
                throw new Exception("CEP não pode ser vazio!");

            if (string.IsNullOrEmpty(cliente.Logradouro))
                throw new Exception("Endereço não pode ser vazio!");

            if (string.IsNullOrEmpty(cliente.Numero))
                throw new Exception("Número não pode ser vazio!");

            if (string.IsNullOrEmpty(cliente.Bairro))
                throw new Exception("Bairro não pode ser vazio!");

            if (string.IsNullOrEmpty(cliente.Cidade))
                throw new Exception("Cidade não pode ser vazio!");

            if (string.IsNullOrEmpty(cliente.UF))
                throw new Exception("UF não pode ser vazio!");
        }

        #endregion
    }
}