using System.Text.Json.Serialization;

namespace sgosat.Dominio.Entidades
{
    public class Pessoa
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
        public bool Cliente { get; set; }
        public bool Funcionario { get; set; }
        public bool Ativo { get; set; }
        [JsonIgnore]
        public Usuario Usuario { get; set; }

        public Pessoa()
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

        public void DeletarCliente()
        {
            Cliente = false;
        }

        public void RestaurarCliente()
        {
            Cliente = true;
        }

        public void DeletarFuncionario()
        {
            Funcionario = false;
        }
        
        public void RestaurarFuncionario()
        {
            Funcionario = true;
        }
    }
}