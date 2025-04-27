namespace sgosat.Api.Models.Funcionarios.Request
{
    public class FuncionarioCriar
    {
        public string Nome { get; set; }
        public string Documento { get; set; }
        public DateTime DataAdmissao { get; set; }
        public string Telefone { get; set; }
        public decimal Salario { get; set; }
        public int TipoFuncionarioID { get; set; }
    }
}