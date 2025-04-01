import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Home.module.css";

export function Home() {
    return (
        <div className={style.conteudo}>
            <Sidebar>
                <Topbar texto="Home">
                    <div className={style.pagina_conteudo}>
                        <h3>Home</h3>
                    </div>
                </Topbar>
            </Sidebar>
        </div>
    );
}