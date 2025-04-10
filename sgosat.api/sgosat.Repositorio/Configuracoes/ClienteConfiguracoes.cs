using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Configuracoes
{
    public class ClienteConfiguracoes : IEntityTypeConfiguration<Cliente>
    {
        public void Configure(EntityTypeBuilder<Cliente> builder)
        {
            builder.ToTable("Cliente").HasKey(c => c.ID);

            builder.Property(nameof(Cliente.ID)).HasColumnName("ID");
            builder.Property(nameof(Cliente.Nome)).HasColumnName("Nome").IsRequired(true);
            builder.Property(nameof(Cliente.TipoPessoa)).HasColumnName("TipoPessoa").IsRequired(true);
            builder.Property(nameof(Cliente.Documento)).HasColumnName("Documento").IsRequired(true);
            builder.Property(nameof(Cliente.Telefone)).HasColumnName("Telefone").IsRequired(true);
            builder.Property(nameof(Cliente.CEP)).HasColumnName("CEP").IsRequired(true);
            builder.Property(nameof(Cliente.Logradouro)).HasColumnName("Logradouro").IsRequired(true);
            builder.Property(nameof(Cliente.Numero)).HasColumnName("Numero").IsRequired(true);
            builder.Property(nameof(Cliente.Complemento)).HasColumnName("Complemento");
            builder.Property(nameof(Cliente.Bairro)).HasColumnName("Bairro").IsRequired(true);
            builder.Property(nameof(Cliente.Cidade)).HasColumnName("Cidade").IsRequired(true);
            builder.Property(nameof(Cliente.UF)).HasColumnName("UF").IsRequired(true);;
            builder.Property(nameof(Cliente.Ativo)).HasColumnName("Ativo").IsRequired(true);

            builder
                .HasMany(c => c.OrdensServicos) // Define o relacionamento de Cliente para Ordens de Serviços
                .WithOne(o => o.Cliente) // Define o relacionamento inverso de Ordem de Serviço para Cliente
                .HasForeignKey(o => o.ClienteID) // Especifica que a chave estrangeira para o relacionamento estará na tabela Ordem de Serviço com a coluna ClienteID
                .OnDelete(DeleteBehavior.Cascade); // Define que, ao excluir um Cliente, a Ordem de Serviço será excluído automaticamente.
        }
    }
}