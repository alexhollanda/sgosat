using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Configuracoes
{
    public class FuncionarioConfiguracoes : IEntityTypeConfiguration<Funcionario>
    {
        public void Configure(EntityTypeBuilder<Funcionario> builder)
        {
            builder.ToTable("Funcionario").HasKey(f => f.ID);

            builder.Property(nameof(Funcionario.ID)).HasColumnName("ID");
            builder.Property(nameof(Funcionario.Nome)).HasColumnName("Nome");
            builder.Property(nameof(Funcionario.Documento)).HasColumnName("Documento");
            builder.Property(nameof(Funcionario.Telefone)).HasColumnName("Telefone");
            builder.Property(nameof(Funcionario.Salario)).HasColumnName("Salario");
            builder.Property(nameof(Funcionario.Ativo)).HasColumnName("Ativo");
            builder.Property(nameof(Funcionario.TipoFuncionarioID)).HasColumnName("TipoFuncionarioID");

            builder
                .HasMany(f => f.OrdensServicos) // Define o relacionamento de Funcionário para Ordens de Serviços
                .WithOne(o => o.Funcionario) // Define o relacionamento inverso de Ordem de Serviço para Funcionário
                .HasForeignKey(o => o.ClienteID) // Especifica que a chave estrangeira para o relacionamento estará na tabela Ordem de Serviço com a coluna ClienteID
                .OnDelete(DeleteBehavior.Cascade); // Define que, ao excluir um Cliente, a Ordem de Serviço será excluído automaticamente.

            builder
                .HasOne(f => f.Usuario) // Define o relacionamento de Funcionário para Usuário
                .WithOne(u => u.Funcionario) // Define o relacionamento inverso de Usuário para Funcionário
                .HasForeignKey<Usuario>(u => u.FuncionarioID) // Especifica que a chave estrangeira para o relacionamento estará na tabela Usuário com a coluna FuncionarioID
                .OnDelete(DeleteBehavior.Cascade); // Define que, ao excluir um Funcionário, o Usuário será excluído automaticamente.
        }
    }
}