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

export function EditarUsuario() {
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
        if (isFormValid()) {
            await UsuarioAPI.atualizarAsync(id, userName, tipoUsuarioID);
            navigate("/usuarios");
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    const isFormValid = () => {
        return userName && tipoUsuarioID;
    }


    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar texto="Editar Usuário" colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Editar Usuário</h3>

                    <Form onSubmit={handleSubmit}>
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
                                <Col sm={12}>
                                    <Form.Group controlId="formUserName" className="mb-3">
                                        <Form.Label>Nome de Usuário:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome de Usuário"
                                            name="userName"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group controlId="formUserName" className="mb-3">
                                        <Form.Label>E-mail:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="E-mail"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group controlId="formSenha" className="mb-3">
                                        <Form.Label>Senha:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="************"
                                            name="senha"
                                            value={senha}
                                            required
                                            disabled
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