namespace sgosat.Api.Models.Pessoas.Response
{
    public class PessoaResponse
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public string TipoPessoa { get; set; }
        public string Documento { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string CEP { get; set; }
        public string Logradouro { get; set; }
        public string Numero { get; set; }
        public string Complemento { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string UF { get; set; }
    }
}