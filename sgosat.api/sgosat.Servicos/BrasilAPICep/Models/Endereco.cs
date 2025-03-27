namespace sgosat.Servicos.BrasilAPICep.Models
{
    public class Endereco
    {
        public string Cep { get; set; }
        public string Logradouro { get; set; }
        public string Bairro { get; set; }
        public string Localidade { get; set; } 
        public string Estado { get; set; }   
        public string UF { get; set; }    
    }
}