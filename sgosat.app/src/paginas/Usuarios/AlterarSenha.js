import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./EditarUsuario.module.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UsuarioAPI from "../../services/usuarioAPI";
import FuncionarioAPI from "../../services/funcionarioAPI";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
    const [senha, setSenha] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState(false);

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
                setSenha(usuario.senha);
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
        if (isFormValid()) {
            if (senha != senhaAtual) {
                setMensagem("A senha atual informada não confere!" + senha);
                setErro(true);
                return;
            }

            if (novaSenha !== confirmarSenha) {
                setMensagem("A nova senha e a confirmação não conferem!");
                setErro(true);
                return;
            }
            try {
                await UsuarioAPI.alterarSenhaAsync(id, novaSenha, senhaAtual);
                setMensagem("Senha alterada com sucesso!");
                setErro(false);
                setSenhaAtual("");
                setNovaSenha("");
                setConfirmarSenha("");
                setTimeout(() => {
                    navigate("/usuarios"); // ou qualquer rota desejada
                  }, 1000);
            } catch (error) {
                setMensagem(error.response?.data || "Erro ao alterar senha.");
                setErro(true);
            }
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    const isFormValid = () => {
        return senhaAtual && novaSenha && confirmarSenha;
    }


    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar texto="Editar Usuário" colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Alterar Senha do Usuário</h3>

                    <Form onSubmit={handleSubmit}>
                        {mensagem && (
                            <Alert variant={erro ? "danger" : "success"}>{mensagem}</Alert>
                        )}
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
                                            placeholder="************"
                                            name="senhaAtual"
                                            value={senhaAtual}
                                            onChange={(e) => setSenhaAtual(e.target.value)}
                                            required

                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group controlId="formNovaSenha" className="mb-3">
                                        <Form.Label>Digite a Nova Senha:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="************"
                                            name="novaSenha"
                                            value={novaSenha}
                                            onChange={(e) => setNovaSenha(e.target.value)}
                                            required

                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group controlId="formConfirmaSenha" className="mb-3">
                                        <Form.Label>Confirme a Nova Senha:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="************"
                                            name="confirmaSenha"
                                            value={confirmarSenha}
                                            onChange={(e) => setConfirmarSenha(e.target.value)}
                                            required

                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="success" type="submit" className={style.btn} disabled={!isFormValid()}>
                                Salvar
                            </Button>
                            <Button variant="danger" type="button" className={style.btn} onClick={() => navigate("/usuarios")}>
                                Cancelar
                            </Button>

                        </Container>
                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    )
}