import Table from "react-bootstrap/esm/Table";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./OrdensServico.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ClienteAPI from "../../services/clienteAPI";
import OrdemServicoAPI from "../../services/ordemServicoAPI";


export function OrdensServico() {
    const [colapsada, setColapsada] = useState(true);
    const [clientes, setClientes] = useState([]);
    const [ordens, setOrdens] = useState([]);
    const [statusOS, setStatusOS] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [ordemSelecionada, setOrdemSelecionada] = useState(null);

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

    async function fetchClientes() {
        try {
            const listaClientes = await ClienteAPI.listarAsync(true);
            setClientes(listaClientes);
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
        }
    }

    async function fetchOrdens() {
        try {
            const listaOrdens = await OrdemServicoAPI.listarAsync(true);
            setOrdens(listaOrdens)
        } catch (error) {
            console.error("Erro ao carregar ordens de serviço:", error);
        }
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
        fetchOrdens();
        fetchClientes();
        fetchStatusOS();
    }, []);

    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Ordens de Serviço</h3>
                        <Button variant="danger" type="button" className={style.botao_novo} onClick={() => navigate("/ordens/nova")}>
                            <BsFillPersonPlusFill />Nova
                        </Button>
                    </div>

                    <div className={style.tabela}>
                        <Table responsive striped hover>
                            <thead className={style.tabela_cabecalho}>
                                <tr>
                                    <th>ID</th>
                                    <th>Data Abertura</th>
                                    <th>Cliente</th>
                                    <th>Telefone</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={style.tabela_corpo}>

                                {ordens.map((ordem) => {
                                    return (

                                        <tr key={ordem.id}>
                                            <td>{String(ordem.id).padStart(5, '0')}</td>
                                            <td>{formatarData(ordem.dataAbertura)}</td>
                                            <td>{clientes.find(c => c.id === ordem.clienteID)?.nome.substring(0, 40) +
                                                (clientes.find(c => c.id === ordem.clienteID)?.nome.length > 40 ? "..." : "") || "Não encontrado"}</td>
                                            <td>{formataPhone(clientes.find(c => c.id === ordem.clienteID)?.telefone)}</td>
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