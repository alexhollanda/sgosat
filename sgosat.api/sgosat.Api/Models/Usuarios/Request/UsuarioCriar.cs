using sgosat.Dominio.Entidades;

namespace sgosat.Api.Models.Usuario.Request
{
    public class UsuarioCriar
    {
        public string UserName { get; set; }
        public string Senha { get; set; }
        public Pessoa Pessoa { get; set; }
    }
}