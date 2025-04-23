import Table from "react-bootstrap/esm/Table";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Usuarios.module.css";
import { MdEdit, MdDelete, MdOutlineKey } from "react-icons/md";
import UsuarioAPI from "../../services/usuarioAPI";
import { useEffect, useState } from "react";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FuncionarioAPI from "../../services/funcionarioAPI";


export function Usuarios() {
    const [colapsada, setColapsada] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

    const navigate = useNavigate();

    const handleClickDeletar = (usuario) => {
        setUsuarioSelecionado(usuario);
        setMostrarModal(true);
    }

    const handleDeletar = async () => {
        try {
            await UsuarioAPI.deletarAsync(usuarioSelecionado.id);
            setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioSelecionado.id));
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
        } finally {
            handleFechareModal();
        }
    };

    const handleFechareModal = () => {
        setMostrarModal(false);
        setUsuarioSelecionado(null);
    }

    async function fetchUsuarios() {
        try {
            const listaUsuarios = await UsuarioAPI.listarAsync(true);
            setUsuarios(listaUsuarios);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    }

    async function fetchFuncionarios() {
        try {
            const listaFuncionarios = await FuncionarioAPI.listarAsync(true);
            setFuncionarios(listaFuncionarios);
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);
        }
    }

    useEffect(() => {
        fetchUsuarios();
        fetchFuncionarios();
    }, []);



    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar texto="Usuários" colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Usuários</h3>
                        <Button variant="danger" type="button" className={style.botao_novo} onClick={() => navigate("/usuarios/novo")}>
                            <BsFillPersonPlusFill />Novo
                        </Button>
                    </div>

                    <div className={style.tabela}>
                        <Table responsive>
                            <thead className={style.tabela_cabecalho}>
                                <tr>
                                    <th>ID</th>
                                    <th>Funcionário</th>
                                    <th>Nome do Usuário</th>
                                    <th>E-mail</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={style.tabela_corpo}>

                                {usuarios.map((usuario) => {
                                    return (

                                        <tr key={usuario.id}>
                                            <td>{String(usuario.id).padStart(6, '0')}</td>
                                            <td>{funcionarios.find(f => f.id === usuario.funcionarioID)?.nome || "Não encontrado"}</td>
                                            <td>{usuario.userName}</td>
                                            <td>{usuario.email}</td>
                                            <td>
                                                <Link to='/usuarios/editar' state={usuario.id} className={style.botao_editar}>
                                                    <MdEdit />
                                                </Link>
                                                <button onClick={() => handleClickDeletar(usuario)} className={style.botao_deletar}>
                                                    <MdDelete />
                                                </button>
                                                <Link to='/usuarios/alterarsenha' state={usuario.id} className={style.botao_editar}>
                                                    <MdOutlineKey />
                                                </Link>
                                                
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </Table>
                    </div>

                    <Modal show={mostrarModal} onHide={handleFechareModal} className={style.custom_modal}>
                        <Modal.Header className={style.modal_header} closeButton>
                            <Modal.Title className={style.modal_title}>Confirmar</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className={style.modal_content}>
                            Tem certeza que deseja deletar o usuario <b>{usuarioSelecionado?.userName}</b>?
                        </Modal.Body>

                        <Modal.Footer className={style.modal_footer}>
                            <Button variant="primary" className={style.btn_primary} onClick={handleFechareModal}>
                                Cancelar
                            </Button>

                            <Button variant="danger" className={style.btn_danger} onClick={handleDeletar}>
                                Deletar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Topbar>
        </Sidebar>
    )
}