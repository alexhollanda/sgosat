using System.Text.Json.Serialization;

namespace sgosat.Dominio.Entidades
{
    public class Cliente
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public string TipoPessoa { get; set; }
        public string Documento { get; set; }
        public string Telefone { get; set; }
        public string CEP { get; set; }
        public string Logradouro { get; set; }
        public string Numero { get; set; }
        public string Complemento { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string UF { get; set; }
        public bool Ativo { get; set; }
        [JsonIgnore]
        public List<OrdemServico> OrdensServicos { get; set; }

        public Cliente()
        {
            Ativo = true;
        }

        public void Deletar()
        {
            Ativo = false;
        }

        public void Restaurar()
        {
            Ativo = true;
        }
    }
}