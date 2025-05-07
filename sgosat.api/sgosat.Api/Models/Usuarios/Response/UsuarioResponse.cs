using sgosat.Dominio.Entidades;

namespace sgosat.Api.Models.Usuarios.Response
{
    public class UsuarioResponse
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int FuncionarioID { get; set; }
        public int TipoUsuarioID { get; set; }
        
    }
}