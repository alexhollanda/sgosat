import style from './NovaOrdemServico.module.css';
import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ClienteAPI from "../../services/clienteAPI";
import FuncionarioAPI from "../../services/funcionarioAPI";
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import { Topbar } from '../../componentes/Topbar/Topbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import OrdemServicoAPI from '../../services/ordemServicoAPI';

export function NovaOrdemServico() {
    const [colapsada, setColapsada] = useState(true);
    const [dataAbertura, setDataAbertura] = useState('');
    const [dataConclusao, setDataConclusao] = useState('');
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState('');
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
    const [descricaoProblema, setDescricaoProblema] = useState('');
    const [servicoRealizado, setServicoRealizado] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [valor, serValor] = useState('');
    const [statusOSID, setStatusOSID] = useState('');
    const [statusOS, setStatusOS] = useState([]);
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();

    async function fetchClientes() {
        try {
            const listaClientes = await ClienteAPI.listarAsync(true);
            setClientes(listaClientes);
            setLoading(false);
        }
        catch (error) {
            console.error('Erro ao carregar clientes:', error);
            setLoading(false);
        }
    }

    async function fetchFuncionarios() {
        try {
            const listaFuncionarios = await FuncionarioAPI.listarAsync(true);
            setFuncionarios(listaFuncionarios);
            setLoading(false);
        }
        catch (error) {
            console.error('Erro ao carregar funcionarios:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
        const dia = String(hoje.getDate()).padStart(2, '0');

        const dataFormatada = `${ano}-${mes}-${dia}`;
        setDataAbertura(dataFormatada);

        const fetchStatusOS = async () => {
            try {
                const status = await OrdemServicoAPI.listarStatusOS();
                setStatusOS(status);

            } catch (error) {
                console.error("Erro ao listar os status das ordens de serviço:", error);
            }
        }

        fetchClientes();
        fetchFuncionarios();
        fetchStatusOS();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid()) {

            navigate("/ordens");
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    const isFormValid = () => {

    };

    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Nova Ordem de Serviço:</h3>
                    <hr></hr>

                    <Form onSubmit={handleSubmit}>
                        <Container>

                            <Row>
                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="formData">
                                        <Form.Label>Data de Abertura:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dataAbertura"
                                            value={dataAbertura}
                                            onChange={(e) => setDataAbertura(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="formDataConclusao">
                                        <Form.Label>Data de Conclusão:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dataConclusao"
                                            value={dataConclusao}
                                            onChange={(e) => setDataConclusao(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="formStatusOS">
                                        <Form.Label>Status:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="statusOSID"
                                            value={statusOSID}
                                            onChange={(e) => setStatusOSID(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Status da Ordem de Serviço</option>
                                            {statusOS.map((status) => (
                                                <option key={status.id} value={status.id}>
                                                    {status.nome}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>


                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="formCliente">
                                        <Form.Label>Cliente</Form.Label>
                                        {loading ? (
                                            <Spinner animation="border" />
                                        ) : (
                                            <Typeahead
                                                id="cliente-typeahead"
                                                labelKey="nome"
                                                options={clientes}
                                                placeholder="Digite para buscar o cliente..."
                                                onChange={setClienteSelecionado}
                                                selected={clienteSelecionado}
                                                minLength={2}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="descricaoProblema">
                                        <Form.Label>Descrição do Problema</Form.Label>
                                        <Form.Control as="textarea" rows={3} style={{ resize: 'none' }} placeholder="Descreva o problema aqui..." />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="servicoRealizado">
                                        <Form.Label>Serviço Realizado</Form.Label>
                                        <Form.Control as="textarea" rows={3} style={{ resize: 'none' }} placeholder="Informe o que foi feito..." />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="observacoes">
                                        <Form.Label>Observações</Form.Label>
                                        <Form.Control as="textarea" rows={3} style={{ resize: 'none' }} placeholder="Alguma observação adicional?" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={9}>
                                    <Form.Group className="mb-3" controlId="formFuncionario">
                                        <Form.Label>Funcionario:</Form.Label>
                                        {loading ? (
                                            <Spinner animation="border" />
                                        ) : (
                                            <Typeahead
                                                id="funcionario-typeahead"
                                                labelKey="nome"
                                                options={funcionarios}
                                                placeholder="Digite para buscar o funcionário..."
                                                onChange={setFuncionarioSelecionado}
                                                selected={funcionarioSelecionado}
                                                minLength={2}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group className="mb-3" controlId="formFuncionario">
                                        <Form.Label>Funcionario:</Form.Label>
                                        {loading ? (
                                            <Spinner animation="border" />
                                        ) : (
                                            <Typeahead
                                                id="funcionario-typeahead"
                                                labelKey="nome"
                                                options={funcionarios}
                                                placeholder="Digite para buscar o funcionário..."
                                                onChange={setFuncionarioSelecionado}
                                                selected={funcionarioSelecionado}
                                                minLength={2}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="success" type="submit" className={style.btn} disabled={!isFormValid()}>
                                Salvar
                            </Button>

                            <Button variant="danger" type="button" className={style.btn} onClick={() => navigate("/ordens")}>
                                Cancelar
                            </Button>
                        </Container>


                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    )
}
