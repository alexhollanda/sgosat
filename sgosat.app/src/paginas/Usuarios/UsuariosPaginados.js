import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./UsuariosPaginados.module.css";
import { MdEdit, MdDelete, MdOutlineKey } from "react-icons/md";
import UsuarioAPI from "../../services/usuarioAPI";
import React, { useEffect, useState } from "react";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';
import { FaSortAlphaDown, FaSortNumericDown, FaListOl } from "react-icons/fa";
import {
    Spinner,
    Table,
    Form,
    Button,
    Row,
    Col,
    Dropdown,
    DropdownButton,
} from "react-bootstrap";
import FuncionarioAPI from "../../services/funcionarioAPI";


export function UsuariosPaginados() {
    const [colapsada, setColapsada] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [tamanhoPagina, setTamanhoPagina] = useState(5);
    const [order, setOrder] = useState(1);
    const [nome, setNome] = useState("");
    const [userName, setUsername] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [totalRegistros, setTotalRegistros] = useState(0);

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

    useEffect(() => {
        buscarUsuarios();
    }, [paginaAtual, order, tamanhoPagina]);

    // debounce para nome/usserName
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setPaginaAtual(1); // volta para primeira página ao buscar
            buscarUsuarios();
        }, 500); // espera 500ms após última digitação

        return () => clearTimeout(delayDebounce); // limpa timeout anterior
    }, [nome, userName]);

    const buscarUsuarios = async () => {
        try {
            setCarregando(true);
            const response = await UsuarioAPI.obterPaginadoAsync(
                paginaAtual,
                tamanhoPagina,
                order,
                nome,
                userName);
            setUsuarios(response);
            if (response.length > 0) setTotalRegistros(response[0].totalRegistros || 0);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setCarregando(false);
        }
    };

    const totalPaginas = Math.ceil(totalRegistros / tamanhoPagina);

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

                    <Row className="mb-3">
                        <Col md={3}>
                            <Form.Control
                                placeholder="Buscar por nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </Col>

                        <Col md={3}>
                            <Form.Control
                                placeholder="Buscar por User Name"
                                value={userName}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Col>

                        <Col md={3}>
                            <DropdownButton
                                variant="outline-dark"
                                title={
                                    <>
                                        <FaSortAlphaDown className="me-2" />
                                        Ordenar por: {order === 1 ? "ID" : "Nome"}
                                    </>
                                }
                                className="dropdown-estilizado"
                                onSelect={(key) => {
                                    setOrder(parseInt(key));
                                    setPaginaAtual(1);
                                }}
                            >
                                <Dropdown.Item eventKey="1">
                                    <FaSortNumericDown className="me-2 text-secondary" />
                                    ID
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="2">
                                    <FaSortAlphaDown className="me-2 text-secondary" />
                                    Nome
                                </Dropdown.Item>
                            </DropdownButton>
                        </Col>

                        <Col md={3}>
                            <DropdownButton
                                variant="outline-dark"
                                title={
                                    <>
                                        <FaListOl className="me-2" />
                                        Exibir: {tamanhoPagina} por página
                                    </>
                                }
                                className="dropdown-estilizado"
                                onSelect={(key) => {
                                    setTamanhoPagina(parseInt(key));
                                    setPaginaAtual(1);
                                }}
                            >
                                <Dropdown.Item eventKey="5">5</Dropdown.Item>
                                <Dropdown.Item eventKey="10">10</Dropdown.Item>
                                <Dropdown.Item eventKey="20">20</Dropdown.Item>
                                <Dropdown.Item eventKey="50">50</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>

                    <div className={style.tabela}>
                        {carregando ? (
                            <div className="text-center">
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            <>
                                <Table striped hover responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Funcionário</th>
                                            <th>Nome do Usuário</th>
                                            <th>E-mail</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map(usuario => (
                                            <tr key={usuario.id}>
                                                <td>{String(usuario.id).padStart(5, '0')}</td>
                                                <td>{usuario.nome.substring(0, 40) + (usuario.nome.length > 40 ? "..." : "")}</td>
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
                                        ))}
                                    </tbody>
                                </Table>

                                <Row className="justify-content-between align-items-center">
                                    <Col xs="auto">
                                        Página {paginaAtual} de {totalPaginas}
                                    </Col>
                                    <Col xs="auto">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                                            disabled={paginaAtual === 1}
                                        >
                                            Anterior
                                        </Button>{' '}
                                        <Button
                                            variant="primary"
                                            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                                            disabled={paginaAtual === totalPaginas}
                                        >
                                            Próximo
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        )}
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