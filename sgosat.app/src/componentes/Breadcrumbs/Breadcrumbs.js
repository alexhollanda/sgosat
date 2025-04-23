import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

export function Breadcrumbs() {
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x);

    const formatLabel = (segment) => {
        switch (segment.toLowerCase()) {
            case 'clientes': return 'Clientes';
            case 'usuario': return 'Usuário';
            case 'usuarios': return 'Usuários';
            case 'cliente': return 'Cliente';
            case 'novo': return 'Novo';
            case 'nova': return 'Nova';
            case 'editar': return 'Editar';
            case 'ordens': return 'Ordens de Serviço';
            case 'funcionarios': return 'Funcionários';
            default: return segment.charAt(0).toUpperCase() + segment.slice(1);
        }
    };

    return (
        <nav className={styles.breadcrumb}>
            <Link to="/home">Início</Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                    <span key={to}> / {formatLabel(value)}</span>
                ) : (
                    <span key={to}>
                        {' / '}
                        <Link to={to}>{formatLabel(value)}</Link>
                    </span>
                );
            })}
        </nav>
    );
}
