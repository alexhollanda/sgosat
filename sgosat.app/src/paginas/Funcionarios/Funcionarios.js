import Table from "react-bootstrap/esm/Table";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Funcionarios.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import PessoaAPI from "../../services/pessoaAPI";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export function Funcionarios() {
    const [colapsada, setColapsada] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

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
            await PessoaAPI.deletarClienteAsync(funcionarioSelecionado.id);
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

    async function fetchFuncionarios() {
        try {
            const listaFuncionarios = await PessoaAPI.listarFuncionariosAsync(true);
            setFuncionarios(listaFuncionarios);
        } catch (error) {
            console.error("Erro ao carregar funcionarios:", error);
        }
    }

    useEffect(() => {
        fetchFuncionarios();
    }, []);



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

                    <div className={style.tabela}>
                        <Table responsive striped hover>
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

                                {funcionarios.map((funcionario) => {
                                    return (

                                        <tr key={funcionario.id}>
                                            <td>{String(funcionario.id).padStart(5, '0')}</td>
                                            <td>{funcionario.nome.substring(0,40) + (funcionario.nome.length > 40 ? "..." : "")}</td>
                                            <td>{formataDocumento(funcionario.documento)}</td>
                                            <td>{formataPhone(funcionario.telefone)}</td>
                                            <td>{funcionario.email}</td>
                                            <td>
                                                <Link to='/funcionarios/editar' state={funcionario.id} className={style.botao_editar}>
                                                    <MdEdit />
                                                </Link>
                                                <button onClick={() => handleClickDeletar(funcionario)} className={style.botao_deletar}>
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