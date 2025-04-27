namespace sgosat.Api.Models.Funcionarios.Response
{
    public class FuncionarioPaginado
    {
        public int ID { get; set; }   
        public string Nome { get; set; }
        public string Documento { get; set; }
        public string Telefone { get; set; }
        public int TotalRegistros { get; set; }
    }
}