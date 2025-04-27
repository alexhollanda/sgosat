import style from './NovoCliente.module.css';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClienteAPI from '../../services/clienteAPI';
import axios from 'axios';
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import { Topbar } from '../../componentes/Topbar/Topbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function EditarCliente() {
    const [colapsada, setColapsada] = useState(true);
    const [nome, setNome] = useState('');
    const [documento, setDocumento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const [id] = useState(location.state);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await ClienteAPI.obterAsync(id);
                if (response.tipoPessoa == "PF")
                    setDocumento(formataCPF(response.documento));
                else setDocumento(formataCNPJ(response.documento));
                setNome(response.nome);
                setTelefone(formataPhone(response.telefone));
                setCep(aplicarMascaraCep(response.cep));
                setLogradouro(response.logradouro);
                setNumero(response.numero);
                setComplemento(response.complemento);
                setBairro(response.bairro);
                setCidade(response.cidade);
                setUF(response.uf);
            } catch (error) {
                console.error("Erro ao buscar clientes: ", error);
            }
        }

        fetchClientes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Remove as máscaras antes de enviar
        const dadosSemMascara = {
            telefoneLimpo: removeMask(telefone),
            documentoLimpo: removeMask(documento),
            cepLimpo: removeMask(cep)
        };

        if (isFormValid()) {
            try {
                await ClienteAPI.atualizarAsync(id, nome, dadosSemMascara.telefoneLimpo, dadosSemMascara.cepLimpo,
                                                logradouro, numero, complemento, bairro, cidade, uf)
                navigate("/clientes");
            } catch (error) {
                console.log("Erro ao salvar o cliente:", error);
            }

        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    }

    const isFormValid = () => {
        return (nome && telefone && cep && logradouro && numero && bairro && cidade && uf);
    };


    //#region Funções e Validação e Máscaras
    const [errorPhone, setErrorPhone] = useState(''); // Mensagem de erro pro Telefone
    const [errorCep, setErrorCep] = useState(''); // Mensagem de erro pro CEP

    const buscarCep = async () => {
        const cepLimpo = getRawValue(cep);

        if (cepLimpo.length !== 8) {
            setErrorCep("CEP inválido.");
            return;
        }

        try {
            const resposta = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            if (resposta.data.erro) {
                setErrorCep("CEP não encontrado.");
            } else {
                setErrorCep("");
                const cepEncontrado = {
                    logradouro: resposta.data.logradouro.toUpperCase(),
                    bairro: resposta.data.bairro.toUpperCase(),
                    cidade: resposta.data.localidade.toUpperCase(),
                    uf: resposta.data.uf,
                }
                setLogradouro(cepEncontrado.logradouro);
                setBairro(cepEncontrado.bairro);
                setCidade(cepEncontrado.cidade);
                setUF(cepEncontrado.uf);
            }
        } catch (err) {
            setErrorCep("Erro ao buscar CEP.");
        }
    };

    const aplicarMascaraCep = (valor) => {
        return valor
            .replace(/\D/g, '') // Remove tudo que não for número
            .replace(/^(\d{5})(\d)/, '$1-$2') // Aplica a máscara XXXXX-XXX
            .slice(0, 9); // Limita a 9 caracteres
    };

    const handleCepChange = (e) => {
        const valorComMascara = aplicarMascaraCep(e.target.value);
        setCep(valorComMascara);
    }

    function formataPhone(value) {
        value = value.replace(/\D/g, '');
        if (value.length <= 10) {
            return value
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            return value
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{1})(\d{4})(\d)/, '$1 $2-$3');
        }
    }

    function formataCPF(value) {
        return value
            .replace(/\D/g, '') // Remove tudo que não for dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca o traço
    };

    function formataCNPJ(value) {
        return value
            .replace(/\D/g, '') // Remove tudo que não for dígito
            .replace(/(\d{2})(\d)/, '$1.$2') // Coloca o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o segundo ponto
            .replace(/(\d{3})(\d)/, '$1/$2') // Coloca a barra
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2'); // Coloca o traço
    };

    // Função para remover a máscara e obter o valor puro
    function getRawValue(value) {
        return value.replace(/[().\s\-\/]/g, '');
    }

    const removeMask = (value) => {
        return value.replace(/\D/g, ''); // Remove tudo que não for dígito
    }
    
    const handleTelefoneChange = (event) => {
        setTelefone(getRawValue(event.target.value));
        setErrorPhone('');
    };

    const handleFocusTelefone = () => {
        setTelefone(getRawValue(telefone)); // Remove a máscara ao focar
    };

    const handleBlurTelefone = () => {
        setTelefone(formataPhone(telefone));

        // Validação básica para telefone (10 ou 11 dígitos)
        const rawValue = getRawValue(telefone);
        if (rawValue.length < 10 || rawValue.length > 11) {
            setErrorPhone('Número de telefone inválido!');
        } else {
            setErrorPhone('');
        }
    };

    //#endregion

    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Editar Cliente</h3>
                    <hr></hr>

                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col sm={3}>
                                    <Form.Group controlId="formDocumento" className="mb-3">
                                        <Form.Label>Documento</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                name="documento"
                                                value={documento}
                                                disabled
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group controlId="formNome" className="mb-3">
                                        <Form.Label>Nome do Cliente</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome do Cliente"
                                            name="nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value.toUpperCase()) || ""}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group controlId="formTelefone" className="mb-3">
                                        <Form.Label>Telefone:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telefone"
                                            maxLength={11}
                                            value={telefone}
                                            onChange={handleTelefoneChange}
                                            onFocus={handleFocusTelefone} // Remove máscara ao focar
                                            onBlur={handleBlurTelefone}   // Aplica máscara ao sair
                                            placeholder="(99) 9 9999-9999"
                                            isInvalid={!!errorPhone}
                                            required
                                        />
                                        {errorPhone && (
                                            <Form.Control.Feedback type="invalid">
                                                {errorPhone}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={3}>
                                    <Form.Group controlId="formCep" className="mb-3">
                                        <Form.Label>CEP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="CEP"
                                            name="cep"
                                            value={cep}
                                            onChange={handleCepChange}
                                            onBlur={buscarCep}
                                            isInvalid={!!errorCep}
                                            required
                                        />
                                        {errorCep && (
                                            <Form.Control.Feedback type="invalid">
                                                {errorCep}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col sm={7}>
                                    <Form.Group controlId="formLogradouro" className="mb-3">
                                        <Form.Label>Logradouro</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Logradouro"
                                            name="logradouro"
                                            value={logradouro}
                                            onChange={(e) => setLogradouro(e.target.value.toUpperCase())}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={2}>
                                    <Form.Group controlId="formNumero" className="mb-3">
                                        <Form.Label>Número</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Número"
                                            name="numero"
                                            value={numero}
                                            onChange={(e) => setNumero(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <Form.Group controlId="formComplemento" className="mb-3">
                                        <Form.Label>Complemento</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Complemento"
                                            name="complemento"
                                            value={complemento}
                                            onChange={(e) => setComplemento(e.target.value.toUpperCase())}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group controlId="formBairro" className="mb-3">
                                        <Form.Label>Bairro</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Bairro"
                                            name="bairro"
                                            value={bairro}
                                            onChange={(e) => setBairro(e.target.value.toUpperCase())}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={9}>
                                    <Form.Group controlId="formCidade" className="mb-3">
                                        <Form.Label>Cidade</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Cidade"
                                            name="cidade"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value.toUpperCase())}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group controlId="formUF" className="mb-3">
                                        <Form.Label>UF</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="uf"
                                            value={uf}
                                            onChange={(e) => setUF(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Selecione a UF</option>
                                            <option value="AC">AC - Acre</option>
                                            <option value="AL">AL - Alagoas</option>
                                            <option value="AM">AM - Amazonas</option>
                                            <option value="AP">AP - Amapá</option>
                                            <option value="BA">BA - Bahia</option>
                                            <option value="CE">CE - Ceará</option>
                                            <option value="DF">DF - Distrito Federal</option>
                                            <option value="ES">ES - Espírito Santo</option>
                                            <option value="GO">GO - Goiás</option>
                                            <option value="MA">MA - Maranhão</option>
                                            <option value="MG">MG - Minas Gerais</option>
                                            <option value="MS">MS - Mato Grosso do Sul</option>
                                            <option value="MT">MS - Mato Grosso</option>
                                            <option value="PA">PA - Pará</option>
                                            <option value="PB">PB - Paraíba</option>
                                            <option value="PE">PE - Pernambuco</option>
                                            <option value="PI">PI - Piauí</option>
                                            <option value="PR">PR - Paraná</option>
                                            <option value="RJ">RJ - Rio de Janeiro</option>
                                            <option value="RN">RN - Rio Grande do Norte</option>
                                            <option value="RO">RO - Rondônia</option>
                                            <option value="RR">RR - Roraima</option>
                                            <option value="RS">RS - Rio Grande do Sul</option>
                                            <option value="SC">SC - Santa Catarina</option>
                                            <option value="SE">SE - Sergipe</option>
                                            <option value="SP">SP - São Paulo</option>
                                            <option value="TO">TO - Tocantins</option>
                                        </Form.Control>
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

};
