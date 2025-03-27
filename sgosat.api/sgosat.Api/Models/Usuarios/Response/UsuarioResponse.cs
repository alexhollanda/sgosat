using sgosat.Dominio.Entidades;

namespace sgosat.Api.Models.Usuario.Response
{
    public class UsuarioResponse
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public Pessoa Pessoa { get; set; }
        
    }
}