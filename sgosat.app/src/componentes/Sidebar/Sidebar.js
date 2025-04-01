import style from './Sidebar.module.css';
import Logo from '../../assets/LogoBranco.png';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { BsPersonCircle } from "react-icons/bs";

export function Sidebar({ children }) {
    return (
        <div>
            <div className={style.sidebar_conteudo}>
                <div className={style.sidebar_header}>
                    <img src={Logo} alt="Logo" className={style.logo} />
                    <hr className={style.linha}/>
                </div>

                <div className={style.sidebar_corpo}>
                    <SidebarItem texto="Usuários" link="/usuarios" logo={<BsPersonCircle/>} />
                </div>
            </div>
            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </div>
    );
}