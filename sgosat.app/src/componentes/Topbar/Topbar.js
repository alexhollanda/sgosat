import { Link } from 'react-router-dom';
import style from './Topbar.module.css';
import { BsDoorOpenFill } from "react-icons/bs";


export function Topbar({ texto, children }) {
    return (
        <div>
            <div className={style.topbar_conteudo}>
                <h3>{texto}</h3>
            </div>
            <div className={`${style.topbar_conteudo} ${style.topbar_conteudo_right}`}>                
                <Link to="/login" className={style.botao_deslogar}>
                    <BsDoorOpenFill />
                </Link>
            </div>
            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </div>
    );
}