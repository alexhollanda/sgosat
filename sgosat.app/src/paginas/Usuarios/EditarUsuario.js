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
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipoUsuarioID, setTipoUsuarioID] = useState('');
    const [tiposUsuarios, setTiposUsuarios] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioID, setFuncionarioID] = useState('');
    const [usuarios, setUsuarios] = useState([]);

    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const [id] = useState(location.state);

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

        const fetchUsuarios = async () => {
            try {
                const listaUsuarios = await UsuarioAPI.listarAsync(true);
                setUsuarios(listaUsuarios);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        };

        fetchTiposUsuarios();
        fetchFuncionarios();
        fetchUsuario();
        fetchUsuarios();
    }, [id]);

    const validarCampos = () => {
        const novosErros = {};

        if (!userName) novosErros.userName = "Nome de Usuário é obrigatório!";
        if (userName.length < 3) novosErros.userName = "Nome de Usuário deve ter pelo menos 3 caracteres!";
        if (userName.length > 20) novosErros.userName = "Nome de Usuário deve ter no máximo 20 caracteres!";
        const usuarioUserName = usuarios.find(usuario => usuario.userName === userName);
        if (usuarioUserName && usuarioUserName.id !== id) novosErros.userName = "Nome de Usuário já cadastrado!";
        if (userName.includes(" ")) novosErros.userName = "Nome de Usuário não pode conter espaços!";
        if (!email) novosErros.email = "E-mail é obrigatório!";
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) novosErros.email = "E-mail inválido!";
        const usuarioEmail = usuarios.find(usuario => usuario.email === email);
        if (usuarioEmail && usuarioEmail.id !== id) novosErros.email = "E-mail já cadastrado!";
        if (!tipoUsuarioID) novosErros.tipoUsuarioID = "Selecione o tipo de usuário!";

        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroGeral('');
        setSucesso('');

        if (!validarCampos()) {
            setErroGeral("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setLoading(true);

        const payload = {
            ID: id,
            UserName: userName,
            Email: email,
            TipoUsuarioID: tipoUsuarioID
        };

        try {       
            await UsuarioAPI.atualizarAsync(payload);
            setSucesso("Usuário atualizado com sucesso!");
            setLoading(false);
            setUserName('');
            setEmail('');
            setSenha('');
            setFuncionarioID('');
            setTipoUsuarioID('');
            setErros({});
            setLoading(false);
            setTimeout(() => {
                navigate("/usuarios");
            }, 2000);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            setErroGeral(error.response?.data || "Erro ao atualizar usuário!");
        } finally {
            setLoading(false);
        }   
    };


    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar texto="Editar Usuário" colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Editar Usuário</h3>
                    <hr />

                    {erroGeral && <div className="alert alert-danger">{erroGeral}</div>}
                    {sucesso && <div className="alert alert-success">{sucesso}</div>}

                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col sm={6}>
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

                                <Col sm={6}>
                                    <Form.Group controlId="formUserName" className="mb-3">
                                        <Form.Label>Nome de Usuário:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome de Usuário"
                                            className={`fomr-control ${erros.userName ? 'is-invalid' : ''}`}
                                            name="userName"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value.toLowerCase())}
                                        />
                                        {erros.userName && <div className="invalid-feedback">{erros.userName}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={4}>
                                <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label>E-mail:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="E-mail"
                                            className={`fomr-control ${erros.email ? 'is-invalid' : ''}`}
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                        />
                                        {erros.email && <div className="invalid-feedback">{erros.email}</div>}
                                    </Form.Group>
                                </Col>
                            
                                <Col sm={4}>
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
                            
                                <Col sm={4}>
                                <Form.Group controlId="formTipoUsuario" className="mb-3">
                                        <Form.Label>Tipo de Usuário</Form.Label>
                                        <Form.Control
                                            as="select"
                                            className={`fomr-control ${erros.tipoUsuarioID ? 'is-invalid' : ''}`}
                                            name="tipoUsuarioID"
                                            value={tipoUsuarioID}
                                            onChange={(e) => setTipoUsuarioID(e.target.value)}                                            
                                        >
                                            <option value="" disabled>Selecione um tipo de usuário</option>
                                            {tiposUsuarios.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.nome}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        {erros.tipoUsuarioID && <div className="invalid-feedback">{erros.tipoUsuarioID}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="success" type="submit" className={style.btn} disabled={loading}>
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