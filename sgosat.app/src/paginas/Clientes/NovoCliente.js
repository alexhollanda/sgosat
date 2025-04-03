import style from './NovoCliente.module.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PessoaAPI from "../../services/pessoaAPI";
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import { Topbar } from '../../componentes/Topbar/Topbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputMask from 'inputmask';

export function NovoCliente() {
    const [nome, setNome] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('PF');
    const [documento, setDocumento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');
    const cliente = true;
    const funcionario = false;

    const [errorDocumento, setErrorDocumento] = useState(''); // Mensagem de erro pro CPF/CNPJ
    const [errorPhone, setErrorPhone] = useState(''); // Mensagem de erro pro Telefone

    const navigate = useNavigate();

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

    function maskDocument(value, type) {
        return type === 'PF' ? formataCPF(value) : formataCNPJ(value);
    };

    // Função para remover a máscara e obter o valor puro
    function getRawValue(value) {
        return value.replace(/[().\s\-\/]/g, '');
    }

    // Validação de CPF
    function isValidCPF(cpf) {
        cpf = getRawValue(cpf);
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf[i]) * (10 - i);
        }
        let digit1 = (sum * 10) % 11;
        if (digit1 === 10 || digit1 === 11) digit1 = 0;
        if (digit1 !== parseInt(cpf[9])) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf[i]) * (11 - i);
        }
        let digit2 = (sum * 10) % 11;
        if (digit2 === 10 || digit2 === 11) digit2 = 0;
        return digit2 === parseInt(cpf[10]);
    }

    // Validação de CNPJ
    function isValidCNPJ(cnpj) {
        cnpj = getRawValue(cnpj);
        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
        let length = 12;
        let numbers = cnpj.substring(0, length);
        let digits = cnpj.substring(length);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers[length - i]) * pos--;
            if (pos < 2) pos = 9;
        }
        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits[0])) return false;

        length = 13;
        numbers = cnpj.substring(0, length);
        sum = 0;
        pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers[length - i]) * pos--;
            if (pos < 2) pos = 9;
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        return result === parseInt(digits[1]);
    }

    const handleTipoPessoaChange = (event) => {
        setTipoPessoa(event.target.value);
        setDocumento(''); // Limpa o valor ao trocar o tipo
        setErrorDocumento('');
    };

    const handleDocumentoChange = (event) => {
        const rawValue = event.target.value.replace(/\D/g, ''); // Remove a máscara anterior
        setDocumento(rawValue);
        setErrorDocumento('');
    }

    const handleBlurDocumento = () => {
        const maskedValue = maskDocument(documento, tipoPessoa);
        setDocumento(maskedValue);

        // Validação de CPF ou CNPJ
        if (tipoPessoa === 'PF' && !isValidCPF(documento)) {
            setErrorDocumento('CPF inválido!');
            return;
        }

        if (tipoPessoa === 'PJ' && !isValidCNPJ(documento)) {
            setErrorDocumento('CNPJ inválido!');
            return;
        }

        setErrorDocumento(''); // Limpa o erro se for válido
    };

    const handleFocusDocumento = () => {
        setDocumento(getRawValue(documento)); // Remove a máscara ao focar
    }

    const handleTelefoneChange = (event) => {
        //const rawValue = event.target.value.replace(/\D/g, '');
        //setTelefone(rawValue);
        setTelefone(getRawValue(event.target.value));
        setErrorPhone('');
    };

    const handleFocusTelefone = () => {
        setTelefone(getRawValue(telefone)); // Remove a máscara ao focar
    };

    const handleBlurTelefone = () => {
        const maskedValue = formataPhone(telefone);
        setTelefone(maskedValue);

        // Validação básica para telefone (10 ou 11 dígitos)
        const rawValue = getRawValue(telefone);
        if (rawValue.length < 10 || rawValue.length > 11) {
            setErrorPhone('Número de telefone inválido!');
        } else {
            setErrorPhone('');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid()) {
            await PessoaAPI.criarAsync(nome, tipoPessoa, documento, telefone, email, cep,
                logradouro, numero, complemento, bairro, cidade,
                uf, cliente, funcionario);
            navigate("/clientes");
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    const isFormValid = () => {
        return (nome && tipoPessoa && documento && telefone && email && cep
            && logradouro && numero && bairro && cidade && uf);
    };

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Novo Cliente</h3>
                    <hr></hr>

                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col sm={8}>
                                    <Form.Group controlId="formNome" className="mb-3">
                                        <Form.Label>Nome do Cliente</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome do Cliente"
                                            name="nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                </Col>
                                <Col sm={4}>
                                    <Form.Group controlId="formTipoPessoa" className="mb-3">
                                        <Form.Label>Tipo de Pessoa</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="tipoPessoa"
                                            defaultValue="PF"
                                            value={tipoPessoa}
                                            onChange={handleTipoPessoaChange}
                                            required
                                        >
                                            <option value="PF">PESSOA FÍSICA</option>
                                            <option value="PJ">PESSOA JURÍDICA</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm>
                                    <Form.Group controlId="formDocumento" className="mb-3">
                                        <Form.Label>Documento</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="documento"
                                            maxLength={tipoPessoa === 'PF' ? 11 : 14}
                                            value={documento}
                                            onChange={handleDocumentoChange}
                                            onFocus={handleFocusDocumento} // Remove máscara ao focar
                                            onBlur={handleBlurDocumento}   // Aplica máscara ao sair
                                            placeholder={tipoPessoa === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                                            isInvalid={!!errorDocumento}
                                            required
                                        />
                                        {errorDocumento && (
                                            <Form.Control.Feedback type="invalid">
                                                {errorDocumento}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col sm>
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

                                <Col sm>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label>E-mail</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="E-mail do Cliente"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                            required
                                        />
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
                                            onChange={(e) => setCep(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={7}>
                                    <Form.Group controlId="formLogradouro" className="mb-3">
                                        <Form.Label>Logradouro</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Logradouro"
                                            name="logradour"
                                            value={logradouro}
                                            onChange={(e) => setLogradouro(e.target.value)}
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
                                            onChange={(e) => setComplemento(e.target.value)}
                                            required
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
                                            onChange={(e) => setBairro(e.target.value)}
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
                                            placeholder="Complemento"
                                            name="complemento"
                                            value={complemento}
                                            onChange={(e) => setComplemento(e.target.value)}
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
                        </Container>

                        <Button variant="success" type="submit" className={style.btn} disabled={!isFormValid()}>
                            Salvar
                        </Button>

                        <Button variant="danger" type="button" className={style.btn} onClick={() => navigate("/clientes")}>
                            Cancelar
                        </Button>
                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    )
}
