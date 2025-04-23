import Table from "react-bootstrap/esm/Table";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Clientes.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ClienteAPI from "../../services/clienteAPI";


export function Clientes() {
    const [colapsada, setColapsada] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);

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

    const handleClickDeletar = (cliente) => {
        setClienteSelecionado(cliente);
        setMostrarModal(true);
    }

    const handleDeletar = async () => {
        try {
            await ClienteAPI.deletarAsync(clienteSelecionado.id);
            setClientes(clientes.filter(cliente => cliente.id !== clienteSelecionado.id));
        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
        } finally {
            handleFechareModal();
        }
    };

    const handleFechareModal = () => {
        setMostrarModal(false);
        setClienteSelecionado(null);
    }

    async function fetchClientes() {
        try {
            const listaClientes = await ClienteAPI.listarAsync(true);
            setClientes(listaClientes);
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
        }
    }

    useEffect(() => {
        fetchClientes();
    }, []);



    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Clientes</h3>
                        <Button variant="danger" type="button" className={style.botao_novo} onClick={() => navigate("/clientes/novo")}>
                            <BsFillPersonPlusFill />Novo
                        </Button>
                    </div>

                    <div className={style.tabela}>
                        <Table responsive hover>
                            <thead className={style.tabela_cabecalho}>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Documento</th>
                                    <th>Telefone</th>
                                    <th>E-mail</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={style.tabela_corpo}>

                                {clientes.map((cliente) => {
                                    return (

                                        <tr key={cliente.id}>
                                            <td>{String(cliente.id).padStart(5, '0')}</td>
                                            <td>{cliente.nome.substring(0,40) + (cliente.nome.length > 40 ? "..." : "")}</td>
                                            <td>{formataDocumento(cliente.documento)}</td>
                                            <td>{formataPhone(cliente.telefone)}</td>
                                            <td>{cliente.email}</td>
                                            <td>
                                                <Link to='/clientes/editar' state={cliente.id} className={style.botao_editar}>
                                                    <MdEdit />
                                                </Link>
                                                <button onClick={() => handleClickDeletar(cliente)} className={style.botao_deletar}>
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
                            Tem certeza que deseja deletar o cliente <b>{clienteSelecionado?.nome}</b>?
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