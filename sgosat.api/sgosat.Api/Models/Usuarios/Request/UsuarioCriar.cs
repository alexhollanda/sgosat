using sgosat.Dominio.Entidades;

namespace sgosat.Api.Models.Usuario.Request
{
    public class UsuarioCriar
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public int FuncionarioID { get; set; }
        public int TipoUsuarioID { get; set; }
    }
}