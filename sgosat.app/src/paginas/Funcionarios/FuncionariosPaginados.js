import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./FuncionariosPaginados.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
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


export function FuncionariosPaginados() {
    const [colapsada, setColapsada] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [tamanhoPagina, setTamanhoPagina] = useState(5);
    const [order, setOrder] = useState(1);
    const [nome, setNome] = useState("");
    const [documento, setDocumento] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [totalRegistros, setTotalRegistros] = useState(0);

    // Função para formatar CPF ou CNPJ
    function formataDocumento(value) {
        if (!value) return ''; // Verifica se o valor é vazio ou undefined

        const digitos = String(value).replace(/\D/g, ''); // Remove qualquer caractere não numérico

        if (digitos.length === 11) {
            // Formato CPF: 999.999.999-99
            return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (digitos.length === 14) {
            // Formato CNPJ: 99.999.999/9999-99
            return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }

        // Retorna o valor original se não corresponder a CPF ou CNPJ
        return value;
    }

    // Função para formatar telefone brasileiro
    function formataPhone(value) {
        if (!value) return ''; // Verifica se o valor é vazio ou undefined

        const digitos = String(value).replace(/\D/g, ''); // Remove qualquer caractere não numérico

        if (digitos.length === 10) {
            // Formato: (99) 9999-9999
            return digitos.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (digitos.length === 11) {
            // Formato: (99) 9 9999-9999
            return digitos.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
        }

        // Retorna o valor original se não corresponder a um número válido
        return value;
    }

    const navigate = useNavigate();

    const handleClickDeletar = (funcionario) => {
        setFuncionarioSelecionado(funcionario);
        setMostrarModal(true);
    }

    const handleDeletar = async () => {
        try {
            await FuncionarioAPI.deletarAsync(funcionarioSelecionado.id);
            setFuncionarios(funcionarios.filter(funcionario => funcionario.id !== funcionarioSelecionado.id));
        } catch (error) {
            console.error("Erro ao deletar funcionário:", error);
        } finally {
            handleFechareModal();
        }
    };

    const handleFechareModal = () => {
        setMostrarModal(false);
        setFuncionarioSelecionado(null);
    }

    useEffect(() => {
        buscarFuncionarios();
    }, [paginaAtual, order, tamanhoPagina]);

    // debounce para nome/documento
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setPaginaAtual(1); // volta para primeira página ao buscar
            buscarFuncionarios();
        }, 500); // espera 500ms após última digitação

        return () => clearTimeout(delayDebounce); // limpa timeout anterior
    }, [nome, documento]);

    const buscarFuncionarios = async () => {
        try {
            setCarregando(true);
            const response = await FuncionarioAPI.obterPaginadoAsync(
                paginaAtual,
                tamanhoPagina,
                order,
                nome,
                documento);
            setFuncionarios(response);
            if (response.length > 0) setTotalRegistros(response[0].totalRegistros || 0);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
        } finally {
            setCarregando(false);
        }
    };

    const totalPaginas = Math.ceil(totalRegistros / tamanhoPagina);

    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Funcionários</h3>
                        <Button variant="danger" type="button" className={style.botao_novo} onClick={() => navigate("/funcionarios/novo")}>
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
                                placeholder="Buscar por documento"
                                value={documento}
                                onChange={(e) => setDocumento(e.target.value)}
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
                                            <th>Nome</th>
                                            <th>Documento</th>
                                            <th>Telefone</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {funcionarios.map(funcionario => (
                                            <tr key={funcionario.id}>
                                                <td>{String(funcionario.id).padStart(5, '0')}</td>
                                                <td>{funcionario.nome.substring(0, 40) + (funcionario.nome.length > 40 ? "..." : "")}</td>
                                                <td>{formataDocumento(funcionario.documento)}</td>
                                                <td>{formataPhone(funcionario.telefone)}</td>
                                                <td>
                                                    <Link to='/funcionarios/editar' state={funcionario.id} className={style.botao_editar}>
                                                        <MdEdit />
                                                    </Link>
                                                    <button onClick={() => handleClickDeletar(funcionario)} className={style.botao_deletar}>
                                                        <MdDelete />
                                                    </button>
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
                            Tem certeza que deseja deletar o funcinário <b>{funcionarioSelecionado?.nome}</b>?
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