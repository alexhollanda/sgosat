import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./OrdensServico.module.css";
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
import OrdemServicoAPI from "../../services/ordemServicoAPI";


export function OrdensServicoPaginado() {
    const [colapsada, setColapsada] = useState(false);
    const [ordens, setOrdens] = useState([]);
    const [ordemSelecionada, setOrdemSelecionada] = useState(null);
    const [statusOS, setStatusOS] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [tamanhoPagina, setTamanhoPagina] = useState(5);
    const [order, setOrder] = useState(1);
    const [nome, setNome] = useState("");
    const [statusID, setStatusID] = useState(0); // ID do status selecionado
    const [carregando, setCarregando] = useState(false);
    const [totalRegistros, setTotalRegistros] = useState(0);

    // Função para formatar a Data
    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

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

    const handleClickDeletar = (ordem) => {
        setOrdemSelecionada(ordem);
        setMostrarModal(true);
    }

    const handleDeletar = async () => {
        try {
            await OrdemServicoAPI.deletarAsync(ordemSelecionada.id);
            setOrdens(ordens.filter(o => o.id !== ordemSelecionada.id));
        } catch (error) {
            console.error("Erro ao deletar ordem de serviço:", error);
        } finally {
            handleFechareModal();
        }
    };

    const handleFechareModal = () => {
        setMostrarModal(false);
        setOrdemSelecionada(null);
    }

    async function fetchStatusOS() {
        try {
            const listaStatus = await OrdemServicoAPI.listarStatusOS();
            setStatusOS(listaStatus);
        } catch (error) {
            console.error("Erro ao carregar status das ordens de serviço:", error);
        }
    }

    useEffect(() => {
        fetchStatusOS();
    }, []);

    useEffect(() => {
        buscarOrdens();
    }, [paginaAtual, order, tamanhoPagina, statusID]);

    // debounce para nome
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setPaginaAtual(1); // Volta para a primeira página ao buscar
            buscarOrdens()
        }, 500); // espera 500ms após a última digitação

        return () => clearTimeout(delayDebounce);
    }, [nome]);

    const buscarOrdens = async () => {
        try {
            setCarregando(true);
            const response = await OrdemServicoAPI.obterPaginadoAsync(
                paginaAtual,
                tamanhoPagina,
                order,
                nome,
                statusID
            );
            setOrdens(response);
            if (response.length > 0) setTotalRegistros(response[0].totalRegistros || 0);
        } catch (error) {
            console.error("Erro ao buscar ordens:", error);
        } finally {
            setCarregando(false);
        }

    };

    const totalPaginas = Math.ceil(totalRegistros / tamanhoPagina);

    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <Row className="mb-3">
                        <div className={style.pagina_cabecalho}>
                            <h3>Ordens de Serviço</h3>
                            <Button variant="danger" type="button" className={style.botao_novo} onClick={() => navigate("/ordens/nova")}>
                                <BsFillPersonPlusFill />Nova
                            </Button>
                        </div>
                    </Row>

                    <Row className="mb-3">
                        <hr />
                    </Row>

                    <Row className="justify-content-between align-items-center mb-3">
                        <h5>Filtros</h5>
                        <Col xs="auto">
                            <Form.Control
                                placeholder="Buscar por nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </Col>

                        <Col xs="auto">
                            <DropdownButton
                                variant="outline-dark"
                                title={
                                    <>
                                        <FaSortAlphaDown className="me-2" />
                                        Status da Ordem: {" "}
                                        {statusID === 0
                                            ? "Todas"
                                            : statusID === 1
                                                ? "Em Aberto"
                                                : statusID === 2
                                                    ? "Em Andamento"
                                                    : statusID === 3
                                                        ? "Cancelada"
                                                        : statusID === 4
                                                            ? "Concluída"
                                                            : statusID === 5
                                                                ? "Pendente"
                                                                : ""}
                                    </>
                                }
                                className="dropdown-estilizado"
                                onSelect={(key) => {
                                    setStatusID(parseInt(key));
                                    setPaginaAtual(1);
                                }}
                            >
                                <Dropdown.Item eventKey="0">Todas</Dropdown.Item>
                                <Dropdown.Item eventKey="1">Em Aberto</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Em Andamento</Dropdown.Item>
                                <Dropdown.Item eventKey="3">Cancelada</Dropdown.Item>
                                <Dropdown.Item eventKey="4">Concluída</Dropdown.Item>
                                <Dropdown.Item eventKey="5">Pendente</Dropdown.Item>

                            </DropdownButton>
                        </Col>

                        <Col xs="auto">
                            <DropdownButton
                                variant="outline-dark"
                                title={
                                    <>
                                        <FaSortAlphaDown className="me-2" />
                                        Ordenar por: {" "}
                                        {order === 1
                                            ? "ID"
                                            : order === 2
                                                ? "Nome"
                                                : order === 3
                                                    ? "Status"
                                                    : ""}
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

                                <Dropdown.Item eventKey="3">
                                    <FaSortAlphaDown className="me-2 text-secondary" />
                                    Status
                                </Dropdown.Item>
                            </DropdownButton>
                        </Col>

                        <Col xs="auto">
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
                                            <th>Data Abertura</th>
                                            <th>Cliente</th>
                                            <th>Telefone</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordens.map(ordem => (
                                            <tr key={ordem.id}>
                                                <td>{String(ordem.id).padStart(5, '0')}</td>
                                                <td>{formatarData(ordem.dataAbertura)}</td>
                                                <td>{ordem.nome.substring(0, 40) + (ordem.nome.length > 40 ? "..." : "")}</td>
                                                <td>{formataPhone(ordem.telefone)}</td>
                                                <td>{statusOS.find(s => s.id === ordem.statusOSID)?.nome || "Não encontrado"}</td>
                                                <td>
                                                    <Link to='/ordens/editar' state={ordem.id} className={style.botao_editar}>
                                                        <MdEdit />
                                                    </Link>
                                                    <button onClick={() => handleClickDeletar(ordem)} className={style.botao_deletar}>
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
                            Tem certeza que deseja deletar a Ordem de Serviço <b>#{String(ordemSelecionada?.id).padStart(5, '0')}</b>?
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