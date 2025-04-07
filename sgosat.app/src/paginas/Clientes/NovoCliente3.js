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
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Spinner } from 'react-bootstrap';

export function NovoCliente() {
    const [colapsada, setColapsada] = useState(false);
    const [modoAtualizacao, setModoAtualizacao] = useState(false);
    const [formDesabilitado, setFormDesabilitado] = useState(true);
    const [idCliente, setIdCliente] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const schema = Yup.object().shape({
        documento: Yup.string().required('Documento é obrigatório'),
        nome: Yup.string().required('Nome é obrigatório'),
        tipoPessoa: Yup.string().required('Tipo de pessoa é obrigatório'),
        telefone: Yup.string(),
        email: Yup.string().email('E-mail inválido'),
        cep: Yup.string(),
        logradouro: Yup.string(),
        numero: Yup.string(),
        complemento: Yup.string(),
        bairro: Yup.string(),
        cidade: Yup.string(),
        uf: Yup.string(),
        cliente: Yup.boolean(),
        funcionario: Yup.boolean()
    });


    const navigate = useNavigate();

    const buscarClientePorDocumento = async (documento, setValues) => {
        if (!documento || documento.length < 5) return;

        setCarregando(true);

        try {
            const cliente = await PessoaAPI.obterPorDocAsync(documento);

            if (cliente) {
                setValues(cliente); // preencher formulário com dados
                setModoAtualizacao(true);
                setFormDesabilitado(false);
                setIdCliente(cliente.id);
            } else {
                setModoAtualizacao(false);
                setFormDesabilitado(false);
                setIdCliente(null);
            }
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
        } finally {
            setCarregando(false);
        }
    };



    //#region Funções e Validação e Máscaras
    const [errorDocumento, setErrorDocumento] = useState(''); // Mensagem de erro pro CPF/CNPJ
    const [errorPhone, setErrorPhone] = useState(''); // Mensagem de erro pro Telefone
    const [errorCep, setErrorCep] = useState(''); // Mensagem de erro pro CEP

    const buscarCep = async () => {
        const cepLimpo = cep.replace(/\D/g, "");

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

        if (value.length === 11) return formataCPF(value);

        if (value.length === 14) return formataCNPJ(value);
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
        if (documento != null) setDocumento(getRawValue(documento)); // Remove a máscara ao focar
    }

    const handleDocumentoChange = (event) => {
        const rawValue = event.target.value.replace(/\D/g, ''); // Remove a máscara anterior
        setDocumento(rawValue);
        setErrorDocumento('');
    }

    const handleBlurDocumento = () => {
        const maskedValue = maskDocument(documento);
        setDocumento(maskedValue);

        // Validação de CPF ou CNPJ
        if (documento?.length !== 11 && documento?.length !== 14) {
            setErrorDocumento('CPF ou CNPJ inválido!');
            return;
        }

        if (documento?.length === 11 && !isValidCPF(documento)) {
            setErrorDocumento('CPF inválido!');
            return;
        }

        if (documento?.length === 14 && !isValidCNPJ(documento)) {
            setErrorDocumento('CNPJ inválido!');
            return;
        }

        setErrorDocumento(''); // Limpa o erro se for válido
        buscarCliente(documento); // Chama a função para buscar o cliente
    };

    const handleTelefoneChange = (event) => {
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

    //#endregion

    const handleSubmit = async (values, { resetForm }) => {
        try {
            if (modoAtualizacao) {
                await PessoaAPI.atualizarAsync(idCliente, ...Object.values(values));
                alert('Cliente atualizado com sucesso!');
            } else {
                await PessoaAPI.criarAsync(...Object.values(values));
                alert('Cliente cadastrado com sucesso!');
            }

            resetForm();
            setModoAtualizacao(false);
            setFormDesabilitado(true);
            setIdCliente(null);
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            alert('Erro ao salvar cliente. Veja o console para detalhes.');
        }
    };

    return (



        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Novo Cliente</h3>
                    <hr></hr>
                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            nome: '',
                            tipoPessoa: '',
                            documento: '',
                            telefone: '',
                            email: '',
                            cep: '',
                            logradouro: '',
                            numero: '',
                            complemento: '',
                            bairro: '',
                            cidade: '',
                            uf: '',
                            cliente: true,
                            funcionario: false,
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit, handleChange, handleBlur, values, touched, errors, setValues }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                            <Row className="mb-3">
                              <Form.Group as={Col} md="4" controlId="documento">
                                <Form.Label>Documento</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="documento"
                                  value={values.documento}
                                  onChange={handleChange}
                                  onBlur={(e) => {
                                    handleBlur(e);
                                    buscarClientePorDocumento(e.target.value, setValues);
                                  }}
                                  isInvalid={touched.documento && !!errors.documento}
                                  disabled={modoAtualizacao}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.documento}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                  
                            {carregando && <Spinner animation="border" />}
                  
                            {!formDesabilitado && (
                              <>
                                <Row className="mb-3">
                                  <Form.Group as={Col} md="6" controlId="nome">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="nome"
                                      value={values.nome}
                                      onChange={handleChange}
                                      isInvalid={touched.nome && !!errors.nome}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.nome}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                  
                                  <Form.Group as={Col} md="6" controlId="tipoPessoa">
                                    <Form.Label>Tipo Pessoa</Form.Label>
                                    <Form.Control
                                      as="select"
                                      name="tipoPessoa"
                                      value={values.tipoPessoa}
                                      onChange={handleChange}
                                      isInvalid={touched.tipoPessoa && !!errors.tipoPessoa}
                                    >
                                      <option value="">Selecione...</option>
                                      <option value="Física">Física</option>
                                      <option value="Jurídica">Jurídica</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                      {errors.tipoPessoa}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Row>
                  
                                <Row className="mb-3">
                                  <Form.Group as={Col} md="4" controlId="telefone">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="telefone"
                                      value={values.telefone}
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                  
                                  <Form.Group as={Col} md="8" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                      type="email"
                                      name="email"
                                      value={values.email}
                                      onChange={handleChange}
                                      isInvalid={touched.email && !!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.email}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Row>
                  
                                <Row className="mb-3">
                                  <Form.Group as={Col} md="3" controlId="cep">
                                    <Form.Label>CEP</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="cep"
                                      value={values.cep}
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                  
                                  <Form.Group as={Col} md="6" controlId="logradouro">
                                    <Form.Label>Logradouro</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="logradouro"
                                      value={values.logradouro}
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                  
                                  <Form.Group as={Col} md="3" controlId="numero">
                                    <Form.Label>Número</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="numero"
                                      value={values.numero}
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                                </Row>
                  
                                <Row className="mb-3">
                                  <Form.Group as={Col} md="4" controlId="complemento">
                                    <Form.Label>Complemento</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="complemento"
                                      value={values.complemento}
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                  
                                  <Form.Group as={Col} md="4" controlId="bairro">
                                    <Form.Label>Bairro</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="bairro"
                                      value={values.bairro}
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                  
                                  <Form.Group as={Col} md="3" controlId="cidade">
                                    <Form.Label>Cidade</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="cidade"
                                      value={values.cidade}
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                  
                                  <Form.Group as={Col} md="1" controlId="uf">
                                    <Form.Label>UF</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="uf"
                                      value={values.uf}
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                                </Row>
                  
                                <Row className="mb-3">
                                  <Form.Check
                                    type="checkbox"
                                    id="cliente"
                                    label="É Cliente"
                                    name="cliente"
                                    checked={values.cliente}
                                    onChange={handleChange}
                                  />
                                  <Form.Check
                                    type="checkbox"
                                    id="funcionario"
                                    label="É Funcionário"
                                    name="funcionario"
                                    checked={values.funcionario}
                                    onChange={handleChange}
                                  />
                                </Row>
                  
                                <Button variant="primary" type="submit">
                                  {modoAtualizacao ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
                                </Button>
                              </>
                            )}
                          </Form>

                        )}
                    </Formik>
                </div>
            </Topbar>
        </Sidebar>
    )
}
