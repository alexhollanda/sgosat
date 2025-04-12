namespace sgosat.Api.Models.OrdensServico.Request
{
    public class OrdemServicoCriar
    {
        public DateTime DataAbertura { get; set; }
        public DateTime DataConclusao { get; set; }
        public int ClienteID { get; set; }
        public int FuncionarioID { get; set; }
        public string DescricaoProblema { get; set; }
        public string ServicoRealizado { get; set; }
        public string Observacoes { get; set; }
        public decimal Valor { get; set; }
        public int StatusOSID { get; set; }
    }
}