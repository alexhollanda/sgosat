using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Configuracoes
{
    public class OrdemServicoConfiguracoes : IEntityTypeConfiguration<OrdemServico>
    {
        public void Configure(EntityTypeBuilder<OrdemServico> builder)
        {
            builder.ToTable("OrdemServico").HasKey(os => os.ID);

            builder.Property(nameof(OrdemServico.ID)).HasColumnName("ID");
            builder.Property(nameof(OrdemServico.DataAbertura)).HasColumnName("DataAbertura").IsRequired(true);
            builder.Property(nameof(OrdemServico.DataConclusao)).HasColumnName("DataConclusao");
            builder.Property(nameof(OrdemServico.DescricaoProblema)).HasColumnName("DescricaoProblema").IsRequired(true);
            builder.Property(nameof(OrdemServico.DescricaoProblema)).HasColumnName("ServicoRealizado");
            builder.Property(nameof(OrdemServico.DescricaoProblema)).HasColumnName("Observacoes");
            builder.Property(nameof(OrdemServico.StatusOSID)).HasColumnName("StatusOSID").IsRequired(true);
            builder.Property(nameof(OrdemServico.Ativo)).HasColumnName("Ativo").IsRequired(true);
        }
    }
}