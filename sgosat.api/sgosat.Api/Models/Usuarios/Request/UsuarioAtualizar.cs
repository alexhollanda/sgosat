namespace sgosat.Api.Models.Usuarios.Request
{
    public class UsuarioAtualizar
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int TipoUsuarioID { get; set; }
    }
}