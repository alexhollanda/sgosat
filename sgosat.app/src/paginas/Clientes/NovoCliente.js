import style from './NovoCliente.module.css';
import React, { useEffect, useState } from "react";
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
import { Spinner } from 'react-bootstrap';

const getFormDataDefault = (documento = "") => ({
    nome: "",
    tipoPessoa: "",
    documento,
    telefone: "",
    email: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cliente: true,
    funcionario: false
});

export function NovoCliente() {
    const [colapsada, setColapsada] = useState(false);
    const [formData, setFormData] = useState(getFormDataDefault());
    const [id, setId] = useState(null);
    const [modoAtualizacao, setModoAtualizacao] = useState(false);
    const [formDesabilitado, setFormDesabilitado] = useState(true);
    const [carregando, setCarregando] = useState(false);


    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const buscarClientePorDocumento = async (documento) => {
        setCarregando(true);
        try {
            const cliente = await PessoaAPI.obterPorDocAsync(documento);
            setId(cliente.id);
            setFormData(cliente);
            setModoAtualizacao(true);
            setFormDesabilitado(false);
        } catch (error) {
            // Cliente não encontrado (erro 400)
            if (error?.response?.status === 400) {
                setFormData(getFormDataDefault(formData.documento));
                setModoAtualizacao(false);
                setFormDesabilitado(false);
                setId(null);
            }
            else {
                console.error("Erro inesperado ao buscar cliente:", error);
            }
        } finally {
            setCarregando(false);
        }
    };


    //#region Funções e Validação e Máscaras
    const [errorDocumento, setErrorDocumento] = useState(''); // Mensagem de erro pro CPF/CNPJ
    const [errorPhone, setErrorPhone] = useState(''); // Mensagem de erro pro Telefone
    const [errorCep, setErrorCep] = useState(''); // Mensagem de erro pro CEP

    const buscarCep = async () => {
        const cepLimpo = getRawValue(formData.cep);

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
                // setLogradouro(cepEncontrado.logradouro);
                // setBairro(cepEncontrado.bairro);
                // setCidade(cepEncontrado.cidade);
                // setUF(cepEncontrado.uf);
                setFormData((prev) => ({
                    ...prev,
                    logradouro: cepEncontrado.logradouro,
                    bairro: cepEncontrado.bairro,
                    cidade: cepEncontrado.cidade,
                    uf: cepEncontrado.uf
                }));
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
        setFormData((prev) => ({
            ...prev,
            cep: valorComMascara
        }));
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

    function maskDocument(value) {

        if (!value) return ''; // Verifica se o valor é vazio ou undefined

        if (value.length === 11) {
            setFormData((prev) => ({
                ...prev,
                tipoPessoa: "PF"
            }));
            return formataCPF(value);
        }

        if (value.length === 14) {
            setFormData((prev) => ({
                ...prev,
                tipoPessoa: "PJ"
            }));
            return formataCNPJ(value);
        }
    };

    // Função para remover a máscara e obter o valor puro
    function getRawValue(value) {
        return value.replace(/[().\s\-\/]/g, '');
    }

    const removeMask = (value) => {
        return value.replace(/\D/g, ''); // Remove tudo que não for dígito
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

    const handleFocusDocumento = () => {
        if (formData.documento != null)
            setFormData((prev) => ({
                ...prev,
                documento: getRawValue(formData.documento) // Remove a máscara ao focar
            }));
    }

    const handleDocumentoChange = (event) => {
        const rawValue = event.target.value.replace(/\D/g, ''); // Remove a máscara anterior
        setFormData((prev) => ({
            ...prev,
            documento: rawValue
        }));
        setErrorDocumento('');
    }

    const handleBlurDocumento = () => {
        const maskedValue = maskDocument(formData.documento);
        setFormData((prev) => ({
            ...prev,
            documento: maskedValue
        }));

        const rawValue = getRawValue(formData.documento);

        // Validação de CPF ou CNPJ
        if (rawValue?.length !== 11 && rawValue?.length !== 14) {
            setErrorDocumento('CPF ou CNPJ inválido!');
            return;
        }

        if (rawValue?.length === 11 && !isValidCPF(formData.documento)) {
            setErrorDocumento('CPF inválido!');
            return;
        }

        if (rawValue?.length === 14 && !isValidCNPJ(formData.documento)) {
            setErrorDocumento('CNPJ inválido!');
            return;
        }

        setErrorDocumento(''); // Limpa o erro se for válido
        buscarClientePorDocumento(rawValue); // Chama a função para buscar o cliente
    };

    const handleTelefoneChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            telefone: getRawValue(event.target.value)
        }));
        setErrorPhone('');
    };

    const handleFocusTelefone = () => {
        setFormData((prev) => ({
            ...prev,
            telefone: getRawValue(formData.telefone) // Remove a máscara ao focar
        }));
    };

    const handleBlurTelefone = () => {
        const maskedValue = formataPhone(formData.telefone);
        setFormData((prev) => ({
            ...prev,
            telefone: maskedValue
        }));

        // Validação básica para telefone (10 ou 11 dígitos)
        const rawValue = getRawValue(formData.telefone);
        if (rawValue.length < 10 || rawValue.length > 11) {
            setErrorPhone('Número de telefone inválido!');
        } else {
            setErrorPhone('');
        }
    };

    //#endregion

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Remove as máscaras antes de enviar
        const dadosSemMascara = {
            telefoneLimpo: removeMask(formData.telefone),
            documentoLimpo: removeMask(formData.documento),
            cepLimpo: removeMask(formData.cep)
        };

        if (isFormValid()) {
            try {
                if (modoAtualizacao && id) {
                    await PessoaAPI.atualizarAsync(id, formData.nome, formData.tipoPessoa, dadosSemMascara.documentoLimpo,
                        dadosSemMascara.telefoneLimpo, formData.email, dadosSemMascara.cepLimpo, formData.logradouro,
                        formData.numero, formData.complemento, formData.bairro, formData.cidade, formData.uf,
                        formData.cliente, formData.funcionario)
                } else {
                    PessoaAPI.criarAsync(formData.nome, formData.tipoPessoa, dadosSemMascara.documentoLimpo,
                        dadosSemMascara.telefoneLimpo, formData.email, dadosSemMascara.cepLimpo, formData.logradouro,
                        formData.numero, formData.complemento, formData.bairro, formData.cidade, formData.uf,
                        formData.cliente, formData.funcionario);
                }
                navigate("/clientes");
            } catch (error) {
                console.log("Erro ao salvar o cliente:", error);
            }

        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    }   

    const isFormValid = () => {
        return (formData.nome && formData.tipoPessoa && formData.documento && formData.telefone && formData.email
            && formData.cep && formData.logradouro && formData.numero && formData.bairro && formData.cidade && formData.uf);
    };

    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Novo Cliente</h3>
                    <hr></hr>

                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col sm={4}>
                                    <Form.Group controlId="formDocumento" className="mb-3">
                                        <Form.Label>Documento</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                name="documento"
                                                value={formData.documento}
                                                onChange={handleDocumentoChange}
                                                onFocus={handleFocusDocumento} // Remove máscara ao focar
                                                onBlur={handleBlurDocumento}   // Aplica máscara ao sair
                                                isInvalid={!!errorDocumento}
                                                disabled={modoAtualizacao || carregando}
                                                required
                                            />
                                            {carregando && <Spinner animation="border" size="sm" className="ms-2" />}
                                            {errorDocumento && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errorDocumento}
                                                </Form.Control.Feedback>
                                            )}
                                        </InputGroup>
                                    </Form.Group>
                                </Col>

                                <Col sm={8}>
                                    <Form.Group controlId="formNome" className="mb-3">
                                        <Form.Label>Nome do Cliente</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome do Cliente"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            disabled={formDesabilitado}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>

                                <Col sm={6}>
                                    <Form.Group controlId="formTelefone" className="mb-3">
                                        <Form.Label>Telefone:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telefone"
                                            maxLength={11}
                                            value={formData.telefone}
                                            onChange={handleTelefoneChange}
                                            onFocus={handleFocusTelefone} // Remove máscara ao focar
                                            onBlur={handleBlurTelefone}   // Aplica máscara ao sair
                                            placeholder="(99) 9 9999-9999"
                                            isInvalid={!!errorPhone}
                                            disabled={formDesabilitado}
                                            required
                                        />
                                        {errorPhone && (
                                            <Form.Control.Feedback type="invalid">
                                                {errorPhone}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label>E-mail</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="E-mail do Cliente"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={formDesabilitado}
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
                                            value={formData.cep}
                                            onChange={handleCepChange}
                                            onBlur={buscarCep}
                                            isInvalid={!!errorCep}
                                            disabled={formDesabilitado}
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
                                            value={formData.logradouro}
                                            onChange={handleChange}
                                            disabled={formDesabilitado}
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
                                            value={formData.numero}
                                            onChange={handleChange}
                                            disabled={formDesabilitado}
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
                                            value={formData.complemento}
                                            onChange={handleChange}
                                            disabled={formDesabilitado}
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
                                            value={formData.bairro}
                                            onChange={handleChange}
                                            disabled={formDesabilitado}
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
                                            value={formData.cidade}
                                            onChange={handleChange}
                                            disabled={formDesabilitado}
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
                                            value={formData.uf}
                                            onChange={handleChange}
                                            disabled={formDesabilitado}
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

