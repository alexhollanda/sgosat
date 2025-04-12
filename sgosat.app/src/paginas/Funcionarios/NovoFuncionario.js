import style from './NovoFuncionario.module.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FuncionarioAPI from '../../services/funcionarioAPI';
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
import { NumericFormat } from 'react-number-format';

export function NovoFuncionario() {
    const [colapsada, setColapsada] = useState(true);
    const [id, setId] = useState(null);
    const [nome, setNome] = useState('');
    const [dataAdmissao, setDataAdmissao] = useState('');
    const [documento, setDocumento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [salario, setSalario] = useState(0);
    const [tipoFuncionarioID, setTipoFuncionarioID] = useState('');
    const [tiposFuncionarios, setTiposFuncionarios] = useState([]);
    const [modoAtualizacao, setModoAtualizacao] = useState(false);
    const [formDesabilitado, setFormDesabilitado] = useState(true);
    const [carregando, setCarregando] = useState(false);


    const navigate = useNavigate();

    const buscarFuncionarioPorDocumento = async (documento) => {
        setCarregando(true);
        try {
            const funcionario = await FuncionarioAPI.obterPorDocAsync(documento);
            setId(funcionario.id);
            setNome(funcionario.nome);
            setDocumento(maskDocument(funcionario.documento));
            setDataAdmissao(funcionario.dataAdmissao);
            setTelefone(formataPhone(funcionario.telefone));
            setSalario(funcionario.salario);
            setTipoFuncionarioID(funcionario.tipoFuncionarioID);
            setModoAtualizacao(true);
            setFormDesabilitado(false);
        } catch (error) {
            // Funcionário não encontrado (erro 400)
            if (error?.response?.status === 400) {
                setModoAtualizacao(false);
                setFormDesabilitado(false);
                setId(null);
            }
            else {
                console.error("Erro inesperado ao buscar funcionário:", error);
            }
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        const fetchTiposFuncionarios = async () => {
            try {
                const tipos = await FuncionarioAPI.listarTiposFuncionarios();
                setTiposFuncionarios(tipos);
            } catch (error) {
                console.error("Erro ao buscar Tipos de Funcionários:", error);
            }
        }

        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        setDataAdmissao(`${ano}-${mes}-${dia}`);

        fetchTiposFuncionarios();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Remove as máscaras antes de enviar
        const dadosSemMascara = {
            telefoneLimpo: removeMask(telefone),
            documentoLimpo: removeMask(documento)
        };

        if (isFormValid()) {
            try {
                if (modoAtualizacao && id) {
                    await FuncionarioAPI.atualizarAsync(id, nome, dadosSemMascara.telefoneLimpo, salario, tipoFuncionarioID)
                } else {
                    FuncionarioAPI.criarAsync(nome, dadosSemMascara.documentoLimpo, dataAdmissao, dadosSemMascara.telefoneLimpo, salario, tipoFuncionarioID);
                }
                navigate("/funcionarios");
            } catch (error) {
                console.log("Erro ao salvar o funcionário:", error);
            }

        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    }

    const isFormValid = () => {
        return (nome && documento && telefone && dataAdmissao && salario && tipoFuncionarioID);
    };


    //#region Funções e Validação e Máscaras
    const [errorDocumento, setErrorDocumento] = useState(''); // Mensagem de erro pro CPF/CNPJ
    const [errorPhone, setErrorPhone] = useState(''); // Mensagem de erro pro Telefone

    function formataCPF(value) {
        return value
            .replace(/\D/g, '') // Remove tudo que não for dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca o traço
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
            return formataCPF(value);
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
            setErrorDocumento('CPF inválido!');
            return;
        }

        if (rawValue?.length === 11 && !isValidCPF(documento)) {
            setErrorDocumento('CPF inválido!');
            return;
        }

        setDocumento(maskDocument(documento));
        setErrorDocumento(''); // Limpa o erro se for válido
        buscarFuncionarioPorDocumento(rawValue); // Chama a função para buscar o cliente
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
                    <h3>Novo Funcionário</h3>
                    <hr></hr>
                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col sm={4}>
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
                                                tabIndex={1}
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
                                        <Form.Label>Nome do Cliente:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome do Funcionário"
                                            name="nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value.toUpperCase()) || ""}
                                            disabled={formDesabilitado}
                                            tabIndex={2}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>

                                <Col sm={6}>
                                    <Form.Group controlId="formData" className="mb-3">
                                        <Form.Label>Data de Admissão:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dataAdmissao"
                                            value={dataAdmissao}
                                            onChange={(e) => setDataAdmissao(e.target.value)}
                                            disabled={formDesabilitado}
                                            tabIndex={3}
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
                                    <Form.Group controlId="formSalario" className="mb-3">
                                        <Form.Label>Salário:</Form.Label>
                                        <NumericFormat
                                            customInput={Form.Control}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="R$ "
                                            name="salario"
                                            value={salario}
                                            onValueChange={(val) => setSalario(val.floatValue)}
                                            disabled={formDesabilitado}
                                            tabIndex={4}
                                            isNumericString
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
                                            value={telefone}
                                            onChange={handleTelefoneChange}
                                            onFocus={handleFocusTelefone} // Remove máscara ao focar
                                            onBlur={handleBlurTelefone}   // Aplica máscara ao sair
                                            placeholder="(99) 9 9999-9999"
                                            isInvalid={!!errorPhone}
                                            disabled={formDesabilitado}
                                            tabIndex={5}
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
                                    <Form.Group controlId="formTipoUsuario" className="mb-3">
                                        <Form.Label>Tipo de Usuário</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="tipoFuncionarioID"
                                            value={tipoFuncionarioID}
                                            onChange={(e) => setTipoFuncionarioID(e.target.value)}
                                            tabIndex={6}
                                            disabled={formDesabilitado}
                                            required
                                        >
                                            <option value="" disabled>Selecione um tipo de usuário</option>
                                            {tiposFuncionarios.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.nome}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Button variant="success" type="submit" className={style.btn} disabled={!isFormValid()}>
                                Salvar
                            </Button>

                            <Button variant="danger" type="button" className={style.btn} onClick={() => navigate("/funcionarios")}>
                                Cancelar
                            </Button>
                        </Container>
                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    )
};
