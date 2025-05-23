import style from './Sidebar.module.css';
import Logo from '../../assets/logo.png';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { BsFillPieChartFill, BsClipboard2PlusFill , BsList, BsBriefcaseFill, BsFillPeopleFill, BsFillPersonVcardFill } from "react-icons/bs";

// Sidebar.js
export function Sidebar({ children, colapsada, setColapsada }) {
    const toggleSidebar = () => setColapsada(!colapsada);

    return (
        <div>
            <div className={`${style.sidebar_conteudo} ${colapsada ? style.colapsada : ''}`}>
                <div className={style.sidebar_header}>
                    <div className={style.logo_area}>
                        {!colapsada && <img src={Logo} alt="Logo" className={style.logo} />}
                        <button className={style.toggle_btn} onClick={toggleSidebar}>
                            <BsList size={24} />
                        </button>
                    </div>
                    <hr className={style.linha} />
                </div>

                <div className={style.sidebar_corpo}>
                    <SidebarItem texto="Resumo" link="/home" logo={<BsFillPieChartFill />} colapsada={colapsada} />
                    <SidebarItem texto="Ordens de Serviço" link="/ordens" logo={<BsClipboard2PlusFill />} colapsada={colapsada} />
                    <SidebarItem texto="Clientes" link="/clientes" logo={<BsFillPeopleFill  />} colapsada={colapsada} />
                    <SidebarItem texto="Funcionários" link="/funcionarios" logo={<BsBriefcaseFill />} colapsada={colapsada} />
                    <SidebarItem texto="Usuários" link="/usuarios" logo={<BsFillPersonVcardFill />} colapsada={colapsada} />
                </div>
            </div>

            <div className={`${style.pagina_conteudo} ${colapsada ? style.expandido : ''}`}>
                {children}
            </div>
        </div>
    );
}
