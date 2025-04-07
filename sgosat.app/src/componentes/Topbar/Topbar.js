import { Link } from 'react-router-dom';
import style from './Topbar.module.css';
import { BsDoorOpenFill } from "react-icons/bs";
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';

export function Topbar({ children, colapsada }) {
    return (
        <>
            <div
                className={`${style.topbar_wrapper} ${colapsada ? style.colapsada : style.expandida}`}
            >
                <div className={style.topbar_conteudo}>
                    <Breadcrumbs />
                </div>
                <div className={style.topbar_conteudo}>
                    <Link to="/login" className={style.botao_deslogar}>
                        <BsDoorOpenFill />
                    </Link>
                </div>
            </div>

            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </>
    );
}
