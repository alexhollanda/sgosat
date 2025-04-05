import style from './SidebarItem.module.css';
import { Link } from 'react-router-dom';

export function SidebarItem({ texto, link, logo, colapsada }) {
    return (
        // <Link to={link} className={style.sidebar_item}>
        //     {logo}
        //     <h3 className={style.texto_link}>{texto}</h3>
        // </Link>
        <a href={link} className={`${style.sidebar_item} ${colapsada ? style.colapsada : ''}`}>
            <div className={style.sidebar_item_icon}>{logo}</div>
            {!colapsada && <span className={style.sidebar_item_text}>{texto}</span>}
        </a>
    )

}