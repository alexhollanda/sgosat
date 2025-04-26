namespace sgosat.Repositorio.Models.Ordens.Response
{
    public class OrdemPaginado
    {
        public int ID { get; set; }
        public DateTime DataAbertura { get; set; }
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public int StatusOSID { get; set; }
        public int TotalRegistros { get; set; }
    }
}