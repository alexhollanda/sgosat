import Table from "react-bootstrap/esm/Table";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Usuarios.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import UsuarioAPI from "../../services/usuarioAPI";
import { useEffect, useState } from "react";
import PessoaAPI from "../../services/pessoaAPI";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export function Usuarios() {
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
            const listaFuncionarios = await PessoaAPI.listarFuncionariosAsync(true);
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
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Usuários</h3>
                        <Button variant="danger" type="button" className={style.botao_novo} onClick={() => navigate("/usuario/novo")}>
                            <BsFillPersonPlusFill />Novo
                        </Button>
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
                                            <td>{funcionarios.find(f => f.id === usuario.pessoaID)?.nome || "Não encontrado"}</td>
                                            <td>{usuario.userName}</td>
                                            <td>{funcionarios.find(f => f.id === usuario.pessoaID)?.email || "Não encontrado"}</td>
                                            <td>
                                                <Link to='/usuario/editar' state={usuario.id} className={style.botao_editar}>
                                                    <MdEdit />
                                                </Link>
                                                <button onClick={() => handleClickDeletar(usuario)} className={style.botao_deletar}>
                                                    <MdDelete />
                                                </button>
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