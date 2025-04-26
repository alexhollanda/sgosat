namespace sgosat.Api.Models.Clientes.Response
{
    public class ClientePaginado
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public string Documento { get; set; }
        public string Telefone { get; set; }
        public int TotalRegistros { get; set; }
    }
}