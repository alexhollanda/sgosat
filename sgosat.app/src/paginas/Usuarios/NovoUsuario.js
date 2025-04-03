import style from "./NovoUsuario.module.css";
import { useEffect, useState } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UsuarioAPI from "../../services/usuarioAPI";
import PessoaAPI from "../../services/pessoaAPI";

export function NovoUsuario() {
    const [userName, setUserName] = useState('');
    const [senha, setSenha] = useState('');
    const [pessoaID, setPessoaID] = useState('');
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
                const listaFuncionarios = await PessoaAPI.listarFuncionariosAsync(true);
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
            await UsuarioAPI.criarAsync(userName, senha, pessoaID, tipoUsuarioID);
            navigate("/usuarios");
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    const isFormValid = () => {
        return userName && senha && pessoaID && tipoUsuarioID;
    }


    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Novo Usuário</h3>

                    <Form onSubmit={handleSubmit}>                        
                        <Form.Group controlId="formNome" className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Select value={pessoaID} onChange={(e) => setPessoaID(e.target.value)} required>
                                <option value="" disabled>Selecione um funcionário</option>
                                {funcionarios.map((funcionario) => (
                                    <option key={funcionario.ID} value={funcionario.ID}>
                                        {funcionario.nome}
                                    </option>
                                ))}
                            </Form.Select>
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
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
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
                                <option value="" disabled>Selecione um tipo de usuário</option>
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