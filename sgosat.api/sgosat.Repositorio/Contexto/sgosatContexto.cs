using Microsoft.EntityFrameworkCore;
using sgosat.Dominio.Entidades;
using sgosat.Repositorio.Configuracoes;

public class sgosatContexto : DbContext
{
    private readonly DbContextOptions _options;

    /// <summary>
    /// Define o conjunto de entidades.
    /// </summary>
    public DbSet<Pessoa> Pessoas { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }

    public sgosatContexto()
    {}

    public sgosatContexto(DbContextOptions options) : base (options)
    {
        _options = options;
    }

    /// <summary
    ///Configura as opções de conexão com o banco de dados.
    /// </summary>
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (_options == null)
            //NOTEBOOK
            optionsBuilder.UseSqlServer("Server=DESKTOP-G3F377S\\SQLEXPRESS;DataBase=SGOSAT;Integrated Security=SSPI;TrustServerCertificate=True;");
            //DESKTOP
            //optionsBuilder.UseSqlServer("Server=DESKTOP-N0SPDKK\\SQLEXPRESS;DataBase=SGOSAT;Integrated Security=SSPI;TrustServerCertificate=True;");
    }

    /// <summary>
    /// Aplica as configurações de entidade para o modelo do banco de dados.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new PessoaConfiguracoes());
        modelBuilder.ApplyConfiguration(new UsuarioConfiguracoes());
    }
}