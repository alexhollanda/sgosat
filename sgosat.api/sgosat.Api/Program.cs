using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using sgosat.Aplicacao;
using sgosat.Aplicacao.Interfaces;
using sgosat.Repositorio;
using sgosat.Repositorio.Interfaces;
using sgosat.Servicos.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Adicione serviços ao contêiner.
builder.Services.AddScoped<IUsuarioAplicacao, UsuarioAplicacao>();
builder.Services.AddScoped<ICepAplicacao, CepAplicacao>();
builder.Services.AddScoped<IPessoaAplicacao, PessoaAplicacao>();

// Adicione as interfaces de banco de dados
builder.Services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();
builder.Services.AddScoped<IPessoaRepositorio, PessoaRepositorio>();

// Adicione o serviço

builder.Services.AddScoped<IBrasilAPICep, BrasilAPICep>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .SetIsOriginAllowedToAllowWildcardSubdomains()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);

// Adicione o serviço do Banco de Dados
builder.Services.AddDbContext<sgosatContexto>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Saiba mais sobre as configurações do Swagger/OpenAPI em https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure o pipeline de solicitação HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseCors();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
