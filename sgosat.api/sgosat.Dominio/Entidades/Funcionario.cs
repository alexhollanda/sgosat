using System.Text.Json.Serialization;

namespace sgosat.Dominio.Entidades
{
    public class Funcionario
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public string Documento { get; set; }
        public DateTime DataAdmissao { get; set; }
        public string Telefone { get; set; }
        public decimal Salario { get; set; }
        public bool Ativo { get; set; }
        public int TipoFuncionarioID { get; set; }
        [JsonIgnore]
        public Usuario Usuario { get; set; }
        [JsonIgnore]
        public List<OrdemServico> OrdensServicos { get; set; }
        
        public Funcionario()
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