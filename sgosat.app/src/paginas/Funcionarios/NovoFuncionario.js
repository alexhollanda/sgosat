import style from './NovoFuncionario.module.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FuncionarioAPI from '../../services/funcionarioAPI';
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
        if (!nome) novosErros.nome = "Nome do funcionário é obrigatório!";
        if (!dataAdmissao) novosErros.dataAdmissao = "Data de Admissão é obrigatória!";
        if (!salario) novosErros.salario = "Salário é obrigatório!";
        if (!telefone) novosErros.telefone = "Telefone do funcionário é obrigatório!";
        if (!tipoFuncionarioID) novosErros.tipoFuncionarioID = "Selecione um tipo de funcionário!";

        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    };

    const buscarFuncionarioPorDocumento = async (documento) => {
        setCarregando(true);
        try {
            const funcionario = await FuncionarioAPI.obterPorDocAsync(documento);
            setId(funcionario.id);
            setNome(funcionario.nome);
            setDocumento(maskDocument(funcionario.documento));
            setDataAdmissao(funcionario.dataAdmissao?.split("T")[0]);
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
        setErroGeral('');
        setSucesso('');

        if (!validarCampos()) {
            setErroGeral('Por favor, preencha todos os campos obrigatórios.');
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola a página para o topo
            return;
        }

        setCarregando(true);

        const payloadCriar = {
            nome: nome,
            documento: removeMask(documento),
            dataAdmissao: dataAdmissao,
            telefone: removeMask(telefone),
            salario: salario,
            tipoFuncionarioID: tipoFuncionarioID
        };

        const payloadAtualizar = {
            id: id,
            nome: nome,
            telefone: removeMask(telefone),
            salario: salario,
            tipoFuncionarioID: tipoFuncionarioID
        };

        try {
            if (modoAtualizacao && id) {
                await FuncionarioAPI.atualizarAsync(payloadAtualizar)
            } else {
                await FuncionarioAPI.criarAsync(payloadCriar);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo da página
            setSucesso("Funcionário salvo com sucesso!");
            setTimeout(() => {
                navigate("/funcionarios"); // Redireciona para a página de funcionários
            }, 2000); // Redireciona após 2 segundos
        } catch (error) {
            console.log("Erro ao salvar o funcionário:", error);
            setErroGeral(error?.response?.data || "Erro ao salvar o funcionário.");
        } finally {
            setCarregando(false);
        }
    }

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

        if (!isValidCPF(documento)) {
            setErrorDocumento('CPF inválido!');
            return;
        }

        setDocumento(maskDocument(documento));
        setErrorDocumento(''); // Limpa o erro se for válido
        buscarFuncionarioPorDocumento(rawValue); // Chama a função para buscar o funcionário
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

                    {erroGeral && <div className="alert alert-danger">{erroGeral}</div>}
                    {sucesso && <div className="alert alert-success">{sucesso}</div>}

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
                                            className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
                                            placeholder="Nome do Funcionário"
                                            name="nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value.toUpperCase()) || ""}
                                            disabled={formDesabilitado}
                                            tabIndex={2}
                                        />
                                        {erros.nome && <div className="invalid-feedback">{erros.nome}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>

                                <Col sm={6}>
                                    <Form.Group controlId="formData" className="mb-3">
                                        <Form.Label>Data de Admissão:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            className={`form-control ${erros.dataAdmissao ? 'is-invalid' : ''}`}
                                            name="dataAdmissao"
                                            value={dataAdmissao}
                                            onChange={(e) => setDataAdmissao(e.target.value)}
                                            disabled={formDesabilitado || modoAtualizacao}
                                            tabIndex={3}
                                        />
                                        {erros.dataAdmissao && <div className="invalid-feedback">{erros.dataAdmissao}</div>}
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
                                            className={`form-control ${erros.salario ? 'is-invalid' : ''}`}
                                            value={salario}
                                            onValueChange={(val) => setSalario(val.floatValue)}
                                            disabled={formDesabilitado}
                                            tabIndex={4}
                                            isNumericString
                                        />
                                        {erros.salario && <div className="invalid-feedback">{erros.salario}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <Form.Group controlId="formTelefone" className="mb-3">
                                        <Form.Label>Telefone:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className={`form-control ${erros.telefone ? 'is-invalid' : ''}`}
                                            name="telefone"
                                            maxLength={11}
                                            value={telefone}
                                            onChange={handleTelefoneChange}
                                            onFocus={handleFocusTelefone} // Remove máscara ao focar
                                            onBlur={handleBlurTelefone}   // Aplica máscara ao sair
                                            placeholder="(99) 9 9999-9999"
                                            isInvalid={!!errorPhone}
                                            disabled={formDesabilitado}
                                            required
                                            tabIndex={5}
                                        />
                                        {erros.telefone && <div className="invalid-feedback">{erros.telefone}</div>}
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
                                            className={`form-control ${erros.tipoFuncionarioID ? 'is-invalid' : ''}`}
                                            name="tipoFuncionarioID"
                                            value={tipoFuncionarioID}
                                            onChange={(e) => setTipoFuncionarioID(e.target.value)}
                                            tabIndex={6}
                                            disabled={formDesabilitado}
                                        >
                                            <option value="" disabled>Selecione um tipo de usuário</option>
                                            {tiposFuncionarios.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.nome}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        {erros.tipoFuncionarioID && <div className="invalid-feedback">{erros.tipoFuncionarioID}</div>}
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Button variant="success" type="submit" className={style.btn} disabled={carregando}>
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
