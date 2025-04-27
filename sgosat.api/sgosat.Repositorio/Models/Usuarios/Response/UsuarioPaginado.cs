namespace sgosat.Repositorio.Models.Usuarios.Response
{
    public class UsuarioPaginado
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int TotalRegistros { get; set; }
    }
}