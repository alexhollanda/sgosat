using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Configuracoes
{
    public class PessoaConfiguracoes : IEntityTypeConfiguration<Pessoa>
    {
        public void Configure(EntityTypeBuilder<Pessoa> builder)
        {
            builder.ToTable("Pessoa").HasKey(p => p.ID);

            builder.Property(nameof(Pessoa.ID)).HasColumnName("ID");
            builder.Property(nameof(Pessoa.Nome)).HasColumnName("Nome").IsRequired(true);
            builder.Property(nameof(Pessoa.TipoPessoa)).HasColumnName("TipoPessoa").IsRequired(true);
            builder.Property(nameof(Pessoa.Documento)).HasColumnName("Documento").IsRequired(true);
            builder.Property(nameof(Pessoa.Telefone)).HasColumnName("Telefone").IsRequired(true);
            builder.Property(nameof(Pessoa.Email)).HasColumnName("Email").IsRequired(true);
            builder.Property(nameof(Pessoa.CEP)).HasColumnName("CEP").IsRequired(true);
            builder.Property(nameof(Pessoa.Logradouro)).HasColumnName("Logradouro").IsRequired(true);
            builder.Property(nameof(Pessoa.Numero)).HasColumnName("Numero").IsRequired(true);
            builder.Property(nameof(Pessoa.Complemento)).HasColumnName("Complemento");
            builder.Property(nameof(Pessoa.Bairro)).HasColumnName("Bairro").IsRequired(true);
            builder.Property(nameof(Pessoa.Cidade)).HasColumnName("Cidade").IsRequired(true);
            builder.Property(nameof(Pessoa.UF)).HasColumnName("UF").IsRequired(true);
            builder.Property(nameof(Pessoa.Cliente)).HasColumnName("Cliente").IsRequired(true);
            builder.Property(nameof(Pessoa.Funcionario)).HasColumnName("Funcionario").IsRequired(true);
            builder.Property(nameof(Pessoa.Ativo)).HasColumnName("Ativo").IsRequired(true);

            builder
                .HasOne(p => p.Usuario) // Define o relacionamento de Pessoa para Usuário
                .WithOne(u => u.Pessoa) // Define o relacionamento inverso de Usuário para Pessoa
                .HasForeignKey<Usuario>(u => u.PessoaID) // Especifica que a chave estrangeira para o relacionamento estará na tabela Usuário com a coluna PessoaID
                .OnDelete(DeleteBehavior.Cascade); // Define que, ao excluir uma Pessoa, o Usuário será excluído automaticamente.
        }
    }
}