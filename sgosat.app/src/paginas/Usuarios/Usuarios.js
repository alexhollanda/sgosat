import Table from "react-bootstrap/esm/Table";
import { Link } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Usuarios.module.css";

export function Usuarios() {

    const usuarios = [
        {
            id: 1,
            nome: "João da Silva",
            nome_usuario: "joaodasilva",
            email: "joaosilva@email.com"
        },
        {
            id: 2,
            nome: "Maria Oliveira",
            nome_usuario: "mariaoliveira",
            email
        }
    ]

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Usuarios</h3>
                        <Link to='/usuario/novo' className={style.botao_novo}>+ Novo</Link>
                    </div>

                    <div className={style.tabela}>
                        <Table responsive>
                            <thead className={style.tabela_cabecalho}>
                                <tr>
                                    <th>Nome</th>
                                    <th>Nome do Usuário</th>
                                    <th>E-mail</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={style.tabela_corpo}>

                            </tbody>
                        </Table>
                    </div>
                </div>
            </Topbar>
        </Sidebar>
    )
}