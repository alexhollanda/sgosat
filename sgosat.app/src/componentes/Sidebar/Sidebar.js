import style from './Sidebar.module.css';

export function Sidebar({ children }) {
    return (
        <div>
            <div className={style.sidebar_conteudo}>

            </div>
            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </div>
    );
}