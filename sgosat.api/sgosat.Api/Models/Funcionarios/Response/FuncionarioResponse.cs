namespace sgosat.Api.Models.Funcionarios.Response
{
    public class FuncionarioResponse
    {
        public int ID{ get; set; }       
        public string Nome { get; set; }
        public string Documento{ get; set; }
        public DateTime DataAdmissao { get; set; }
        public string Telefone { get; set; }
        public decimal Salario { get; set; }
        public int TipoFuncionarioID { get; set; }
    }
}