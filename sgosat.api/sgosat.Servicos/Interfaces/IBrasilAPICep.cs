using sgosat.Dominio.Entidades;

namespace sgosat.Servicos.Interfaces
{
    public interface IBrasilAPICep
    {
        Task<Cep> ConsultarCEP(int cep);
    }
}