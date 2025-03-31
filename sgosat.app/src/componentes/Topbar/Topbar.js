import style from './Topbar.module.css';

export function Topbar({ children }) {
    return (
        <div>
            <div className={style.topbar_conteudo}>
                
            </div>
            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </div>
    );
}