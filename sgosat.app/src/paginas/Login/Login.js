import React, { useState } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import UsuarioAPI from '../../services/usuarioAPI';
import logo from '../../assets/logo.png';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [senha, setSenha] = useState('');
    const [lembrar, setLembrar] = useState(localStorage.getItem('userName') ? true : false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);
    const { login } = useAuth();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setErro('');
        setSucesso('');
        setCarregando(true);

        try {
            const usuario = { userName: userName, senha: senha }
            const response = await UsuarioAPI.LoginAsync(usuario);

            if (!response) {
                setErro('Email ou senha inválidos.');
                return;
            }

            login(response);

            //const data = await response.json();
            setSucesso("Usuário autenticado com Sucesso!");

            if (lembrar) {
                localStorage.setItem('userName', userName);
            } else {
                localStorage.removeItem('userName');
            }

            setTimeout(() => {
                navigate("/home");
            }, 1000);

            // Aqui você pode salvar token, redirecionar, etc.
        } catch (error) {
            setErro('Erro ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-left">
                <h1>Bem-vindo ao SGOSAT</h1>
                <p>Gerencie suas ordens de serviço com eficiência e praticidade.</p>
            </div>

            <div className="login-right">
                <Card className="login-card">
                    <Card.Body className="p-4">
                        <div className="text-center mb-4">
                            <img src={logo} alt="Logo SGOSAT" className="login-logo" />
                            <h4 className="login-title">Acesso ao Sistema</h4>
                        </div>

                        {erro && <Alert variant="danger">{erro}</Alert>}
                        {sucesso && <Alert variant="success">{sucesso}</Alert>}

                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId="formUsername" className="mb-3">
                                <Form.Label>Nome de Usuário:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite seu nome de usuário"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formSenha" className="mb-4">
                                <Form.Label>Senha:</Form.Label>
                                <div className="d-flex">
                                    <Form.Control
                                        type={mostrarSenha ? 'text' : 'password'}
                                        placeholder="Digite sua senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                        className="ms-2"
                                        title={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
                                    >
                                        {mostrarSenha ? '🙈' : '👁️'}
                                    </Button>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="lembrarUserName" className="mb-4">
                                <Form.Check
                                    type="checkbox"
                                    label="Lembrar nome de usuário"
                                    checked={lembrar}
                                    onChange={(e) => setLembrar(e.target.checked)}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 login-button" disabled={carregando}>
                                {carregando ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Entrando...
                                    </>
                                ) : (
                                    'Entrar'
                                )}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div >
    );
}

export default Login;