using System.Text.Json.Serialization;

namespace sgosat.Dominio.Entidades
{
    public class OrdemServico
    {
        public int ID { get; set; }
        public DateTime DataAbertura { get; set; }
        public DateTime DataConclusao { get; set; }
        public string DescricaoProblema { get; set; }
        public string ServicoRealizado { get; set; }
        public string Observacoes { get; set; }
        public int StatusOSID { get; set; }
        public bool Ativo { get; set; }

        // Relacionamento muitos-para-muitos
        public ICollection<OrdemServicoPessoas> OrdemServicoPessoas { get; set; } = new List<OrdemServicoPessoas>();

        public OrdemServico()
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