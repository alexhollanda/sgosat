namespace sgosat.Dominio.Entidades
{
    public class OrdemServicoPessoas
    {
        public int OrdemServicoID { get; set; }
        public OrdemServico OrdemServico { get; set; }

        public int PessoaID { get; set; }
        public Pessoa Pessoa { get; set; }
        
        public string Funcao { get; set; }
    }
}