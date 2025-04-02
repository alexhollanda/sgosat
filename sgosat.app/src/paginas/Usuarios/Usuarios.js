import Table from "react-bootstrap/esm/Table";
import { Link } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Usuarios.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import UsuarioAPI from "../../services/usuarioAPI";
import { useEffect, useState } from "react";
import PessoaAPI from "../../services/pessoaAPI";

export function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [pessoas, setPessoas] = useState([]);

    async function fetchUsuarios() {
        try {
            const listaUsuarios = await UsuarioAPI.listarAsync(true);
            setUsuarios(listaUsuarios);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);          
        }
    }

    async function fetchPessoas() {
        try {
            const listaPessoas = await PessoaAPI.listarFuncionariosAsync(true);
            setPessoas(listaPessoas);
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);          
        }
    }
   
    useEffect(() => {
        fetchUsuarios();
        fetchPessoas();
    }, []);

    

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
                                {usuarios.map((usuario) => {                                                                                                           
                                    return (                                    
                                    
                                        <tr key={usuario.ID}>
                                            <td>{pessoas.find(p => p.id === usuario.pessoaID)?.nome || "Não encontrado"}</td>
                                            <td>{usuario.userName}</td>
                                            <td>{pessoas.find(p => p.id === usuario.pessoaID)?.email || "Não encontrado"}</td>
                                            <td>
                                                <Link to='/usuario/editar' state={usuario.id} className={style.botao_editar}>
                                                    <MdEdit />
                                                </Link>
                                                <Link to='/usuario/deletar' className={style.botao_deletar}>
                                                    <MdDelete />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Topbar>
        </Sidebar>
    )
}