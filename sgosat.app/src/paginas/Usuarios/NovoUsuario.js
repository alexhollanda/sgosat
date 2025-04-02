import { useState } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./NovoUsuario.module.css";

export function NovoUsuario() {
    const [userName, setUserName] = useState('');
    const [senha, setSenha] = useState('');
    const [pessoaID, setPessoaID] = useState('');
    const [tipoUsuarioID, setTipoUsuarioID] = useState('');

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Novo Usuário</h3>
                </div>
            </Topbar>
        </Sidebar>
    )
}