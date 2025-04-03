using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sgosat.Dominio.Entidades;

namespace sgosat.Repositorio.Configuracoes
{
    public class OrdemServicoPessoasConfiguracoes : IEntityTypeConfiguration<OrdemServicoPessoas>
    {
        public void Configure(EntityTypeBuilder<OrdemServicoPessoas> builder)
        {
            builder.Property(nameof(OrdemServicoPessoas.OrdemServicoID)).HasColumnName("OrdemServicoID");
            builder.Property(nameof(OrdemServicoPessoas.PessoaID)).HasColumnName("PessoaID");
            builder.Property(nameof(OrdemServicoPessoas.Funcao)).HasColumnName("Funcao");
        }
    }
}