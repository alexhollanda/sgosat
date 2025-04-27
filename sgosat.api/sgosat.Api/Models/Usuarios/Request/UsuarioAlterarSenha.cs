namespace sgosat.Api.Models.Usuarios.Request
{
    public class UsuarioAlterarSenha
    {
        public int ID { get; set; }
        public string Senha { get; set; }
        public string SenhaAntiga { get; set; }
    }
}