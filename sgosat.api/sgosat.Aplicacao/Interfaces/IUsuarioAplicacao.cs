using sgosat.Dominio.Entidades;

namespace sgosat.Aplicacao.Interfaces
{
    public interface IUsuarioAplicacao
    {
        public int Criar(Usuario usuario);
        public void Atualizar(Usuario usuario);
        public void AtualizaSenha(Usuario usuario, string senhaAntiga);
        public Usuario Obter(int usuarioID);
        public Usuario ObterPorEmail(string email);        
        public void Deletar(int usuarioID);
        public void Restaurar(int usuarioID);
        public IEnumerable<Usuario> Listar(bool Ativo);
    }
}