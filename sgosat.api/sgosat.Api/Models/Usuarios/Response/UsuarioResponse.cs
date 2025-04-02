using sgosat.Dominio.Entidades;

namespace sgosat.Api.Models.Usuario.Response
{
    public class UsuarioResponse
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public int TipoUsuarioID { get; set; }
        public int PessoaID { get; set; }
        
    }
}