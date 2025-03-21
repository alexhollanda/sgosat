using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Configuracoes;

public class sgosatContexto : DbContext
{
    /// <summary>
    /// Define o conjunto de entidades.
    /// </summary>
    public DbSet<Usuario> Usuarios { get; set; }

    /// <summary
    ///Configura as opções de conexão com o banco de dados.
    /// </summary>
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=DESKTOP-G3F377S\\SQLEXPRESS;DataBase=SGOSAT;Integrated Security=SSPI;TrustServerCertificate=True;");
    }

    /// <summary>
    /// Aplica as configurações de entidade para o modelo do banco de dados.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UsuarioConfiguracoes());
    }
}