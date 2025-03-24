public abstract class BaseRepositorio
{
    protected readonly sgosatContexto _contexto;

    protected BaseRepositorio(sgosatContexto contexto)
    {
        _contexto = contexto;
    }
}