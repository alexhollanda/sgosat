using System.Text.Json.Serialization;
using sgosat.Dominio.Enumeradores;

namespace sgosat.Dominio.Entidades
{
    public class Usuario
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public string Senha { get; set; }
        public bool Ativo { get; set; }
        public int PessoaID { get; set; }
        public int TipoUsuarioID { get; set; }
        [JsonIgnore]
        public Pessoa Pessoa { get; set; }
        
        public Usuario()
        {
            Ativo = true;
        }

        public void Deletar()
        {
            Ativo = false;
        }

        public void Restaurar()
        {
            Ativo = true;
        }
    }
}