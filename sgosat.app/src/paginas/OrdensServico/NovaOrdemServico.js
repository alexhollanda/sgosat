import style from './NovaOrdemServico.module.css';
import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import PessoaAPI from "../../services/pessoaAPI";
import axios from 'axios';
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import { Topbar } from '../../componentes/Topbar/Topbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export function NovaOrdemServico() {
    const [colapsada, setColapsada] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState('');
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();

    async function fetchClientes() {
        try {
            const listaClientes = await PessoaAPI.listarClientesAsync(true);
            setClientes(listaClientes);
            setLoading(false);
        }
        catch (error) {
            console.error('Erro ao carregar clientes:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
        const dia = String(hoje.getDate()).padStart(2, '0');

        const dataFormatada = `${ano}-${mes}-${dia}`;
        setData(dataFormatada);
        fetchClientes();
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
                                        <Form.Label>Data da Ordem de Serviço</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={data}
                                            onChange={(e) => setData(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={8}>
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

                            <Button variant="success" type="submit" className={style.btn} disabled={!isFormValid()}>
                                Salvar
                            </Button>

                            <Button variant="danger" type="button" className={style.btn} onClick={() => navigate("/clientes")}>
                                Cancelar
                            </Button>
                        </Container>


                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    )
}
