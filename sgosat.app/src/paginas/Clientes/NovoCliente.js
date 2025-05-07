import style from './NovoCliente.module.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Spinner } from 'react-bootstrap';

export function NovoCliente() {
    const [colapsada, setColapsada] = useState(true);
    const [id, setId] = useState(null);
    const [nome, setNome] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('');
    const [documento, setDocumento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');
    const [modoAtualizacao, setModoAtualizacao] = useState(false);
    const [formDesabilitado, setFormDesabilitado] = useState(true);
    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState('');
    const [sucesso, setSucesso] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (erroGeral || sucesso) {
            const timer = setTimeout(() => {
                setErroGeral('');
                setSucesso('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [erroGeral, sucesso]);

    const validarCampos = () => {
        const novosErros = {};

        if (!documento) novosErros.documento = "Documento é obrigatório!";
        if (!nome) novosErros.nome = "Nome do cliente é obrigatório!";
        if (!telefone) novosErros.telefone = "Telefone do cliente é obrigatório!";
        if (!cep) novosErros.cep = "CEP do cliente é obrigatório!";
        if (!logradouro) novosErros.logradouro = "Logradouro do cliente é obrigatório!";
        if (!numero) novosErros.numero = "Número residencial do cliente é obrigatório!";
        if (!bairro) novosErros.bairro = "Bairro do cliente é obrigatório!";
        if (!cidade) novosErros.cidade = "Cidade do cliente é obrigatório!";
        if (!uf) novosErros.uf = "UF do cliente é obrigatório!";

        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    };

    const buscarClientePorDocumento = async (documento) => {
        setCarregando(true);
        try {
            const cliente = await ClienteAPI.obterPorDocAsync(documento);
            setId(cliente.id);
            setNome(cliente.nome);
            setTipoPessoa(cliente.tipoPessoa);
            setDocumento(maskDocument(cliente.documento));
            setTelefone(formataPhone(cliente.telefone));
            setCep(aplicarMascaraCep(cliente.cep));
            setLogradouro(cliente.logradouro);
            setNumero(cliente.numero);
            setBairro(cliente.bairro);
            setCidade(cliente.cidade);
            setUF(cliente.uf);
            setModoAtualizacao(true);
            setFormDesabilitado(false);
        } catch (error) {
            // Cliente não encontrado (erro 400)
            if (error?.response?.status === 400) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroGeral('');
        setSucesso('');

        if (!validarCampos()) {
            setErroGeral("Por favor, preencha todos os campos obrigatórios.");
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo da página
            return;
        }

        setCarregando(true);

        const payloadCriar = {
            nome,
            tipoPessoa,
            documento: removeMask(documento),
            telefone: removeMask(telefone),
            cep: removeMask(cep),
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf
        }

        const payloadAtualizar = {
            id,
            nome,
            telefone: removeMask(telefone),
            cep: removeMask(cep),
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf
        }

        try {
            if (modoAtualizacao && id) {
                await ClienteAPI.atualizarAsync(payloadAtualizar)
            } else {
                ClienteAPI.criarAsync(payloadCriar);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo da página
            setSucesso("Cliente salvo com sucesso!");
            setTimeout(() => {
                navigate("/clientes");
            }, 2000); // Redireciona após 2 segundos
        } catch (error) {
            console.log("Erro ao salvar o cliente:", error);
            setErroGeral(error?.response?.data || "Erro ao salvar o cliente.");
        } finally {
            setCarregando(false);
        }

    }

    //#region Funções e Validação e Máscaras
    const [errorDocumento, setErrorDocumento] = useState(''); // Mensagem de erro pro CPF/CNPJ
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
            setTipoPessoa("PF");
            return formataCPF(value);
        }

        if (value.length === 14) {
            setTipoPessoa("PJ");
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
        if (documento != null) setDocumento(getRawValue(documento)) // Remove a máscara ao focar
    }

    const handleDocumentoChange = (event) => {
        setDocumento(getRawValue(event.target.value)); // Remove a máscara anterior
        setErrorDocumento('');
    }

    const handleBlurDocumento = () => {
        const rawValue = getRawValue(documento);

        // Validação de CPF ou CNPJ
        if (rawValue?.length !== 11 && rawValue?.length !== 14) {
            setErrorDocumento('CPF ou CNPJ inválido!');
            return;
        }

        if (rawValue?.length === 11 && !isValidCPF(documento)) {
            setErrorDocumento('CPF inválido!');
            return;
        }

        if (rawValue?.length === 14 && !isValidCNPJ(documento)) {
            setErrorDocumento('CNPJ inválido!');
            return;
        }

        setDocumento(maskDocument(documento));
        setErrorDocumento(''); // Limpa o erro se for válido
        buscarClientePorDocumento(rawValue); // Chama a função para buscar o cliente
    };

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
                    <h3>Novo Cliente</h3>
                    <hr></hr>

                    {erroGeral && <div className="alert alert-danger">{erroGeral}</div>}
                    {sucesso && <div className="alert alert-success">{sucesso}</div>}

                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col sm={3}>
                                    <Form.Group controlId="formDocumento" className="mb-3">
                                        <Form.Label>Documento:</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                name="documento"
                                                value={documento}
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

                                <Col sm={6}>
                                    <Form.Group controlId="formNome" className="mb-3">
                                        <Form.Label>Nome do Cliente:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
                                            placeholder="Nome do Funcionário"
                                            name="nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value.toUpperCase()) || ""}
                                            disabled={formDesabilitado}
                                        />
                                        {erros.nome && <div className="invalid-feedback">{erros.nome}</div>}
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
                                            disabled={formDesabilitado}                                            
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
                                        <Form.Label>CEP:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="CEP"
                                            name="cep"
                                            value={cep}
                                            onChange={handleCepChange}
                                            onBlur={buscarCep}
                                            isInvalid={!!errorCep}
                                            disabled={formDesabilitado}
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
                                        <Form.Label>Logradouro:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className={`form-control ${erros.logradouro ? 'is-invalid' : ''}`}
                                            placeholder="Logradouro"
                                            name="logradouro"
                                            value={logradouro}
                                            onChange={(e) => setLogradouro(e.target.value.toUpperCase())}
                                            disabled={formDesabilitado}
                                        />
                                        {erros.logradouro && <div className="invalid-feedback">{erros.logradouro}</div>}
                                    </Form.Group>
                                </Col>

                                <Col sm={2}>
                                    <Form.Group controlId="formNumero" className="mb-3">
                                        <Form.Label>Número:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className={`fomr-control ${erros.numero ? 'is-invalid' : ''}`}
                                            placeholder="Número"
                                            name="numero"
                                            value={numero}
                                            onChange={(e) => setNumero(e.target.value)}
                                            disabled={formDesabilitado}
                                        />
                                        {erros.numero && <div className="invalid-feedback">{erros.numero}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <Form.Group controlId="formComplemento" className="mb-3">
                                        <Form.Label>Complemento:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Complemento"
                                            name="complemento"
                                            value={complemento}
                                            onChange={(e) => setComplemento(e.target.value.toUpperCase())}
                                            disabled={formDesabilitado}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group controlId="formBairro" className="mb-3">
                                        <Form.Label>Bairro:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className={`fomr-control ${erros.bairro ? 'is-invalid' : ''}`}
                                            placeholder="Bairro"
                                            name="bairro"
                                            value={bairro}
                                            onChange={(e) => setBairro(e.target.value.toUpperCase())}
                                            disabled={formDesabilitado}
                                        />
                                        {erros.bairro && <div className="invalid-feedback">{erros.bairro}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={9}>
                                    <Form.Group controlId="formCidade" className="mb-3">
                                        <Form.Label>Cidade:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className={`fomr-control ${erros.cidade ? 'is-invalid' : ''}`}
                                            placeholder="Cidade"
                                            name="cidade"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value.toUpperCase())}
                                            disabled={formDesabilitado}
                                        />
                                        {erros.cidade && <div className="invalid-feedback">{erros.cidade}</div>}
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group controlId="formUF" className="mb-3">
                                        <Form.Label>UF:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            className={`fomr-control ${erros.uf ? 'is-invalid' : ''}`}
                                            name="uf"
                                            value={uf}
                                            onChange={(e) => setUF(e.target.value)}
                                            disabled={formDesabilitado}
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
                                        {erros.uf && <div className="invalid-feedback">{erros.uf}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="success" type="submit" className={style.btn} disabled={carregando}>
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

