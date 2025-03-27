using System.Runtime.CompilerServices;
using sgosat.Aplicacao.Interfaces;
using sgosat.Dominio.Entidades;
using sgosat.Servicos.Interfaces;

namespace sgosat.Aplicacao
{
    public class CepAplicacao : ICepAplicacao
    {
        private readonly IBrasilAPICep _brasilApiCep;

        public CepAplicacao(IBrasilAPICep brasilApiCep)
        {
            _brasilApiCep = brasilApiCep;
        }

        public async Task<Cep> ConsultaCEP(int cep)
        {
            return await _brasilApiCep.ConsultarCEP(cep);
        }
    }
}