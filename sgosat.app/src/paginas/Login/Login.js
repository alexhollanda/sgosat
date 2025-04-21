import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import UsuarioAPI from '../../services/usuarioAPI';
import logo from '../../assets/logo.png';
import './Login.module.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [userName, setUserName] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setErro('');
        setSucesso('');

        try {
            const usuario = { userName: userName, senha: senha }
            const response = await UsuarioAPI.LoginAsync(usuario);

            if (!response) {
                setErro('Email ou senha inválidos.');
                return;
            }

            //const data = await response.json();
            setSucesso("Usuário autenticado com Sucesso!");
            setTimeout(() => {
                navigate("/home");
            }, 1000);

            // Aqui você pode salvar token, redirecionar, etc.
        } catch (error) {
            setErro('Erro ao conectar com o servidor.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center login-container">
            <Card className="login-card">
                <Card.Body className="p-4">
                    <div className="text-center mb-4">
                        <img src={logo} alt="Logo SCOSAT" className="login-logo" />
                        <h4 className="login-title">Acesso ao Sistema</h4>
                    </div>

                    {erro && <Alert variant="danger">{erro}</Alert>}
                    {sucesso && <Alert variant="success">{sucesso}</Alert>}

                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formUserName" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite seu Nome de Usuário"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formSenha" className="mb-4">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 login-button">
                            Entrar
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login;