import { useState } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Home.module.css";

export function Home() {
    const [colapsada, setColapsada] = useState(false);

    return (
        <div className={style.conteudo}>
            <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
                <Topbar colapsada={colapsada}>
                    <div className={style.pagina_conteudo}>
                        <h3>Bem-vindo</h3>
                    </div>
                </Topbar>
            </Sidebar>
        </div>
    );
}

