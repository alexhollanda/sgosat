import style from "./NovoUsuario.module.css";
import { useEffect, useState } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UsuarioAPI from "../../services/usuarioAPI";
import FuncionarioAPI from "../../services/funcionarioAPI";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function NovoUsuario() {
    const [colapsada, setColapsada] = useState(true);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [funcionarioID, setFuncionarioID] = useState('');
    const [tipoUsuarioID, setTipoUsuarioID] = useState('');
    const [tiposUsuarios, setTiposUsuarios] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);

    const navigate = useNavigate();

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

        fetchTiposUsuarios();
        fetchFuncionarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid()) {
            await UsuarioAPI.criarAsync(userName, email, senha, funcionarioID, tipoUsuarioID);
            navigate("/usuarios");
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    const isFormValid = () => {
        return userName && email && senha && funcionarioID && tipoUsuarioID;
    }


    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Novo Usuário</h3>

                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col sm={12}>
                                    <Form.Group controlId="formNome" className="mb-3">
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="funcionarioID"
                                            value={funcionarioID}
                                            onChange={(e) => setFuncionarioID(e.target.value)}
                                            required
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
                                        <Form.Label>Senha</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="************"
                                            name="senha"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group controlId="formTipoUsuario" className="mb-3">
                                        <Form.Label>Tipo de Usuário</Form.Label>
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