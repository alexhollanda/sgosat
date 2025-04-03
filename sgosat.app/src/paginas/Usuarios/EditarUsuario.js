import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./EditarUsuario.module.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UsuarioAPI from "../../services/usuarioAPI";
import PessoaAPI from "../../services/pessoaAPI";

export function EditarUsuario() {
    const location = useLocation();
    const navigate = useNavigate();

    const [id] = useState(location.state);

    const [userName, setUserName] = useState('');
    const [tipoUsuarioID, setTipoUsuarioID] = useState('');
    const [tiposUsuarios, setTiposUsuarios] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioID, setFuncionarioID] = useState('');

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
                const listaFuncionarios = await PessoaAPI.listarFuncionariosAsync(true);
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
                setFuncionarioID(usuario.pessoaID);
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
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Editar Usuário</h3>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNome" className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                as="select"
                                name="pessoaID"
                                value={funcionarioID}
                                onChange={(e) => setFuncionarioID(e.target.value)} required disabled
                            >
                                {funcionarios.map((funcionario) => (
                                    <option key={funcionario.ID} value={funcionario.ID}>
                                        {funcionario.nome}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formUserName" className="mb-3">
                            <Form.Label>Nome de Usuário</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome de Usuário"
                                name="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formSenha" className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="************"
                                name="senha"
                                value="************"
                                required
                                disabled
                            />
                        </Form.Group>

                        <Form.Group controlId="formTipoUsuario" className="mb-3">
                            <Form.Label>Tipo de Usuário</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipoUsuarioID"
                                value={tipoUsuarioID}
                                onChange={(e) => setTipoUsuarioID(e.target.value)}
                                required
                            >
                                {tiposUsuarios.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button variant="success" type="submit" className={style.btn} disabled={!isFormValid()}>
                            Salvar
                        </Button>
                        <Button variant="danger" type="button" className={style.btn} onClick={() => navigate("/usuarios")}>
                            Cancelar
                        </Button>
                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    )
}