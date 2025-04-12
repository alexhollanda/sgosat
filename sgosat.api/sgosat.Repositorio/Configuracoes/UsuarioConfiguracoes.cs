using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Configuracoes
{
    public class UsuarioConfiguracoes : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("Usuario").HasKey(u => u.ID);

            builder.Property(nameof(Usuario.ID)).HasColumnName("ID");
            builder.Property(nameof(Usuario.UserName)).HasColumnName("UserName").IsRequired(true);
            builder.Property(nameof(Usuario.Email)).HasColumnName("Email").IsRequired(true);
            builder.Property(nameof(Usuario.Senha)).HasColumnName("Senha").IsRequired(true);
            builder.Property(nameof(Usuario.Ativo)).HasColumnName("Ativo").IsRequired(true);
            builder.Property(nameof(Usuario.FuncionarioID)).HasColumnName("FuncionarioID").IsRequired(true);
            builder.Property(nameof(Usuario.TipoUsuarioID)).HasColumnName("TipoUsuarioID").IsRequired(true);
        }
    }
}