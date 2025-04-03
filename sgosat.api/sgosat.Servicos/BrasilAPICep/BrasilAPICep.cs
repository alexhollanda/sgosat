using Newtonsoft.Json;
using sgosat.Dominio.Entidades;
using sgosat.Servicos.BrasilAPICep.Models;
using sgosat.Servicos.Interfaces;

public class BrasilAPICep : IBrasilAPICep
{
    private readonly HttpClient _httpClient;

    public BrasilAPICep()
    {
        _httpClient = new HttpClient();
        _httpClient.BaseAddress = new Uri("https://viacep.com.br/ws/");
    }

    public async Task<Cep> ConsultarCEP(int cep)
    {
        HttpResponseMessage response = await _httpClient.GetAsync(Convert.ToString(cep) + "/json/");
        response.EnsureSuccessStatusCode();

        string responseBody = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<Endereco>(responseBody);

        var CEP = new Cep{
            CEP = result.Cep,
            Logradouro = result.Logradouro,
            Bairro = result.Bairro,
            Cidade = result.Localidade,
            UF = result.UF
        };

        return CEP;
    }

    public void Dispose()
    {
        throw new NotImplementedException();
    }
}