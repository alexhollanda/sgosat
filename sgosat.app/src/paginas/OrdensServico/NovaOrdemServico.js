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

export function NovaOrdemServico() {
    const [colapsada, setColapsada] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState('');
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();

    useEffect(() => {
        // Substitua a URL abaixo pela sua rota real da API
        PessoaAPI.listarClientesAsync(true)
        .then((response) => {
            setClientes(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Erro ao buscar clientes:', error);
            setLoading(false);
        });        
      }, []);


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
                                    <Form.Group controlId="formData">
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
                                    <Form.Group controlId="formCliente">
                                        <Form.Label>Cliente</Form.Label>
                                        {loading ? (
                                            <Spinner animation="border" />
                                        ) : (
                                            <Form.Select
                                                value={clienteSelecionado}
                                                onChange={(e) => setClienteSelecionado(e.target.value)}
                                                required
                                            >
                                                <option value="">Selecione um cliente</option>
                                                {clientes.map((cliente) => (
                                                    <option key={cliente.id} value={cliente.id}>
                                                        {cliente.nome}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        )}
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
