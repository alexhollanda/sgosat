import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./EditarUsuario.module.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UsuarioAPI from "../../services/usuarioAPI";
import FuncionarioAPI from "../../services/funcionarioAPI";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaSpinner } from 'react-icons/fa';

export function AlterarSenha() {
    const [colapsada, setColapsada] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const [id] = useState(location.state);

    const [userName, setUserName] = useState('');
    const [tipoUsuarioID, setTipoUsuarioID] = useState('');
    const [tiposUsuarios, setTiposUsuarios] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioID, setFuncionarioID] = useState('');
    const [email, setEmail] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (erroGeral || sucesso) {
            const timer = setTimeout(() => {
                setErroGeral('');
                setSucesso('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [erroGeral, sucesso]);

    const validarCampos = () => {
        const novosErros = {};

        if (!senhaAtual) novosErros.senhaAtual = 'Informe a senha atual.';
        if (!novaSenha) novosErros.novaSenha = 'Informe a nova senha.';
        if (novaSenha.length < 6) novosErros.novaSenha = 'A nova senha deve ter pelo menos 6 caracteres.';
        if (!confirmarSenha) novosErros.confirmarSenha = 'Confirme a nova senha.';
        if (novaSenha !== confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem.';

        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    };

    useEffect(() => {
        const fetchTiposUsuarios = async () => {
            try {
                const tipos = await UsuarioAPI.listarTiposUsuarios();
                setTiposUsuarios(tipos);
            } catch (error) {
                console.error("Erro ao buscar tipos de usuários:", error);

            }
        };

        const fetchFuncionarios = async () => {
            try {
                const listaFuncionarios = await FuncionarioAPI.listarAsync(true);
                setFuncionarios(listaFuncionarios);
            } catch (error) {
                console.error("Erro ao buscar funcionários:", error);
            }
        }

        const fetchUsuario = async () => {
            try {
                const usuario = await UsuarioAPI.obterAsync(id);
                setTipoUsuarioID(usuario.tipoUsuarioID);
                setUserName(usuario.userName);
                setFuncionarioID(usuario.funcionarioID);
                setEmail(usuario.email);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        };

        fetchTiposUsuarios();
        fetchFuncionarios();
        fetchUsuario();
    }, []);    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroGeral('');
        setSucesso('');

        if (!validarCampos()) {
            return;
        }

        setCarregando(true);

        try {
            await UsuarioAPI.alterarSenhaAsync(id, novaSenha, senhaAtual);

            setSucesso('Senha alterada com sucesso!');
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            setTimeout(() => {
                navigate("/usuarios"); // ou qualquer rota desejada
            }, 1000);
        } catch (err) {
            setErroGeral(err.response?.data || 'Erro ao alterar senha.');
        } finally {
            setCarregando(false);
        }
    };


    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar texto="Editar Usuário" colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Alterar Senha do Usuário</h3>
                    <hr></hr>

                    {erroGeral && <div className="alert alert-danger">{erroGeral}</div>}
                    {sucesso && <div className="alert alert-success">{sucesso}</div>}

                    <Form onSubmit={handleSubmit} noValidate>
                        <Container>
                            <Row>
                                <Col sm={12}>
                                    <Form.Group controlId="formNome" className="mb-3">
                                        <Form.Label>Funcionário:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="funcionarioID"
                                            value={funcionarioID}
                                            required
                                            disabled
                                        >
                                            <option value="" disabled>Selecione um Funcionário</option>
                                            {funcionarios.map((funcionario) => (
                                                <option key={funcionario.id} value={funcionario.id}>
                                                    {funcionario.nome}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <Form.Group controlId="formUserName" className="mb-3">
                                        <Form.Label>Nome de Usuário:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome de Usuário"
                                            name="userName"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            required
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group controlId="formUserName" className="mb-3">
                                        <Form.Label>E-mail:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="E-mail"
                                            name="email"
                                            value={email}
                                            disabled
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group controlId="formTipoUsuario" className="mb-3">
                                        <Form.Label>Tipo de Usuário:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="tipoUsuarioID"
                                            value={tipoUsuarioID}
                                            onChange={(e) => setTipoUsuarioID(e.target.value)}
                                            required
                                            disabled
                                        >
                                            <option value="" disabled>Selecione um tipo de usuário</option>
                                            {tiposUsuarios.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.nome}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={4}>
                                    <Form.Group controlId="formSenhaAtual" className="mb-3">
                                        <Form.Label>Digite a Senha Atual:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            className={`form-control ${erros.senhaAtual ? 'is-invalid' : ''}`}
                                            name="senhaAtual"
                                            value={senhaAtual}
                                            onChange={(e) => setSenhaAtual(e.target.value)}

                                        />
                                        {erros.senhaAtual && <div className="invalid-feedback">{erros.senhaAtual}</div>}
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group controlId="formNovaSenha" className="mb-3">
                                        <Form.Label>Digite a Nova Senha:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            className={`form-control ${erros.novaSenha ? 'is-invalid' : ''}`}
                                            name="novaSenha"
                                            value={novaSenha}
                                            onChange={(e) => setNovaSenha(e.target.value)}

                                        />
                                        {erros.novaSenha && <div className="invalid-feedback">{erros.novaSenha}</div>}
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group controlId="formConfirmaSenha" className="mb-3">
                                        <Form.Label>Confirme a Nova Senha:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            className={`form-control ${erros.confirmarSenha ? 'is-invalid' : ''}`}
                                            name="confirmaSenha"
                                            value={confirmarSenha}
                                            onChange={(e) => setConfirmarSenha(e.target.value)}

                                        />
                                        {erros.confirmarSenha && <div className="invalid-feedback">{erros.confirmarSenha}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="success" type="submit" className={style.btn} disabled={carregando}>
                                {carregando ? (
                                    <div className="d-flex align-items-center justify-content-center">
                                        <FaSpinner className="me-2" style={{ animation: 'spin 1s linear infinite' }} />
                                        Salvando...
                                    </div>
                                ) : (
                                    'Salvar'
                                )}
                            </Button>
                            <Button variant="danger" type="button" className={style.btn} onClick={() => navigate("/usuarios")}>
                                Cancelar
                            </Button>

                        </Container>
                    </Form>
                    {/* CSS para animar o ícone */}
                    <style>
                        {`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        `}
                    </style>
                </div>
            </Topbar>
        </Sidebar>
    )
}