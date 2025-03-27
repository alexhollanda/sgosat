using Newtonsoft.Json;
using sgosat.Dominio.Entidades;
using sgosat.Servicos.BrasilAPICep.Models;

public class BrasilAPICep
{
    private readonly HttpClient _httpClient;

    public BrasilAPICep()
    {
        _httpClient = new HttpClient();
        _httpClient.BaseAddress = new Uri("https://brasilapi.com.br/api/cep/v1/");
    }

    public async Task<Cep> ConsultarCEP(int cep)
    {
        HttpResponseMessage response = await _httpClient.GetAsync("{cep}");
        response.EnsureSuccessStatusCode();

        string responseBody = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<Endereco>(responseBody);

        var CEP = new Cep{
            CEP = result.Cep,
            Logradouro = result.Street,
            Bairro = result.Neighborhood,
            Cidade = result.City,
            UF = result.State
        };

        return CEP;
    }
}