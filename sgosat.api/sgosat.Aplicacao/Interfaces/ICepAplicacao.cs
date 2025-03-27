using sgosat.Dominio.Entidades;

namespace sgosat.Aplicacao.Interfaces
{
    public interface ICepAplicacao
    {
        Task<Cep> ConsultaCEP(int cep); 
    }
}