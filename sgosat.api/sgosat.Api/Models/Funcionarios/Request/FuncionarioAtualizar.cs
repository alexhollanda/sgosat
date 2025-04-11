namespace sgosat.Api.Models.Funcionarios.Request
{
    public class FuncionarioAtualizar
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public decimal Salario { get; set; }
        public int TipoFuncionarioID { get; set; }
    }
}