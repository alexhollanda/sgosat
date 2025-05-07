import style from './NovaOrdemServico.module.css';
import React, { useState, useEffect } from 'react';
import { data, useNavigate } from "react-router-dom";
import ClienteAPI from "../../services/clienteAPI";
import FuncionarioAPI from "../../services/funcionarioAPI";
import { Sidebar } from '../../componentes/Sidebar/Sidebar';
import { Topbar } from '../../componentes/Topbar/Topbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from "react-select";
import { FaSpinner } from 'react-icons/fa';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import OrdemServicoAPI from '../../services/ordemServicoAPI';

export function NovaOrdemServico() {
    const [colapsada, setColapsada] = useState(true);
    const [dataAbertura, setDataAbertura] = useState('');
    const [dataConclusao, setDataConclusao] = useState(null);
    const [clienteBusca, setClienteBusca] = useState("");
    const [clienteOpcoes, setClienteOpcoes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioID, setFuncionarioID] = useState('');
    const [descricaoProblema, setDescricaoProblema] = useState('');
    const [servicoRealizado, setServicoRealizado] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [valor, setValor] = useState(0);
    const [statusOSID, setStatusOSID] = useState('');
    const [statusOS, setStatusOS] = useState([]);
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    //#region Funções de Formatação

    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
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

    function maskDocument(value) {

        if (!value) return ''; // Verifica se o valor é vazio ou undefined

        if (value.length === 11) {
            return formataCPF(value);
        }

        if (value.length === 14) {
            return formataCNPJ(value);
        }
    };

    //#endregion

    //#region Busca dinâmica de clientes com debounce
    useEffect(() => {
        const delay = setTimeout(() => {
            if (clienteBusca.length >= 3) {
                buscarClientes(clienteBusca);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [clienteBusca]);

    const buscarClientes = async (termo) => {
        setLoading(true);
        try {
            const resposta = await ClienteAPI.obterPorTermoAsync(termo);
            const clientes = Array.isArray(resposta)
                ? resposta.map((c) => ({
                    value: c.id,
                    label: `${c.nome} (${maskDocument(c.documento)})`,
                    dados: c,
                }))
                : [];

            setClienteOpcoes(clientes);
        } catch (err) {
            console.error("Erro ao buscar clientes", err);
            setErroGeral(err.response?.data || "Erro ao buscar clientes");
            setClienteOpcoes([]); // limpa opções em caso de erro
        } finally {
            setLoading(false);
        }
    };
    //#endregion

    async function fetchFuncionarios() {
        try {
            const listaFuncionarios = await FuncionarioAPI.obterTecnicoAsync();
            setFuncionarios(listaFuncionarios);
        }
        catch (error) {
            console.error("Erro ao carregar funcionarios:", error);
            setErroGeral(error.response?.data || "Erro ao carregar funcionarios");
        }
    }

    async function fetchStatusOS() {
        try {
            const status = await OrdemServicoAPI.listarStatusOS();
            setStatusOS(status);

        } catch (error) {
            console.error("Erro ao listar os status das ordens de serviço:", error);
            setErroGeral(error.response?.data || "Erro ao listar os status das ordens de serviço");
        }
    }

    useEffect(() => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
        const dia = String(hoje.getDate()).padStart(2, '0');

        const dataFormatada = `${ano}-${mes}-${dia}`;
        setDataAbertura(dataFormatada);
        setStatusOSID(1);

        fetchFuncionarios();
        fetchStatusOS();
    }, []);

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

        if (!dataAbertura) novosErros.dataAbertura = "Data de Abertura é obrigatória!";
        if (dataConclusao && new Date(dataConclusao) < new Date(dataAbertura)) novosErros.dataConclusao = "Data de Conclusão não pode ser anterior à Data de Abertura!";
        if (dataConclusao && new Date(dataConclusao) > new Date()) novosErros.dataConclusao = "Data de Conclusão não pode ser maior que a data atual!";
        if (!statusOSID) novosErros.statusOSID = "Selecione um Status para a Ordem de Serviço!";
        if (!descricaoProblema.trim()) novosErros.descricaoProblema = "Descrição é obrigatória!";
        if (!clienteSelecionado) novosErros.cliente = "Selecione um cliente!";
        if (!funcionarioID) novosErros.funcionarioID = "Selecione o técnico responsável!";
        if (statusOSID == 4 && !dataConclusao) novosErros.dataConclusao = "Data de Conclusão é obrigatória quando a Ordem de Serviço for Concluída!";
        if (statusOSID == 4 && !servicoRealizado.trim()) novosErros.servicoRealizado = "Serviço realizado é obrigatório quando a Ordem de Serviço for Concluída!";
        if (statusOSID == 4 && valor <= 0) novosErros.valor = "Valor deve ser maior que zero quando a Ordem de Serviço for Concluída!";

        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroGeral('');
        setSucesso('');

        if (!validarCampos()) {
            setErroGeral("Por favor, preencha todos os campos obrigatórios.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);


        const payload = {
            DataAbertura: dataAbertura ? dataAbertura : new Date().toISOString(),
            DataConclusao: dataConclusao ? dataConclusao : null,
            ClienteId: clienteSelecionado?.value,
            FuncionarioID: funcionarioID,
            DescricaoProblema: descricaoProblema,
            ServicoRealizado: servicoRealizado,
            Observacoes: observacoes,
            Valor: valor,
            StatusOSID: statusOSID
        };

        try {
            await OrdemServicoAPI.criarAsync(payload);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setSucesso("Ordem de Serviço incluída com Sucesso!");
            setDataAbertura(null);
            setDataConclusao(null);
            setStatusOSID(0);
            setClienteSelecionado(null);
            setDescricaoProblema("");
            setServicoRealizado("");
            setObservacoes("");
            setFuncionarioID(null);
            setValor(0);
            setTimeout(() => {
                navigate("/ordens");
            }, 1000);
        } catch (error) {
            setErroGeral(error.response?.data || "Erro ao criar Ordem de Serviço");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Nova Ordem de Serviço:</h3>
                    <hr></hr>

                    {erroGeral && <div className="alert alert-danger">{erroGeral}</div>}
                    {sucesso && <div className="alert alert-success">{sucesso}</div>}

                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="formData">
                                        <Form.Label>Data de Abertura:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            className={`form-control ${erros.dataAbertura ? 'is-invalid' : ''}`}
                                            name="dataAbertura"
                                            value={dataAbertura}
                                            onChange={(e) => setDataAbertura(e.target.value)}
                                        />
                                        {erros.dataAbertura && <div className="invalid-feedback">{erros.dataAbertura}</div>}
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="formDataConclusao">
                                        <Form.Label>Data de Conclusão:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            className={`fomr-control ${erros.dataConclusao ? 'is-invalid' : ''}`}
                                            name="dataConclusao"
                                            value={dataConclusao}
                                            onChange={(e) => setDataConclusao(e.target.value)}
                                        />
                                        {erros.dataConclusao && <div className="invalid-feedback">{erros.dataConclusao}</div>}
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="formStatusOS">
                                        <Form.Label>Status:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            className={`fomr-control ${erros.statusOSID ? 'is-invalid' : ''}`}
                                            name="statusOSID"
                                            value={statusOSID}
                                            onChange={(e) => setStatusOSID(e.target.value)}
                                        >
                                            <option value="" disabled>Status da Ordem de Serviço</option>
                                            {statusOS.map((status) => (
                                                <option key={status.id} value={status.id}>
                                                    {status.nome}
                                                </option>
                                            ))}

                                        </Form.Control>
                                        {erros.statusOSID && <div className="invalid-feedback">{erros.statusOSID}</div>}
                                    </Form.Group>
                                </Col>


                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="formCliente">
                                        <Form.Label>Cliente:</Form.Label>
                                        <Select
                                            placeholder="Digite o nome do cliente..."
                                            className={`fomr-control ${erros.cliente ? 'is-invalid' : ''}`}
                                            onInputChange={(input) => setClienteBusca(input)}
                                            onChange={(opcao) => setClienteSelecionado(opcao)}
                                            options={clienteOpcoes}
                                            isLoading={loading}
                                            isClearable
                                            value={clienteSelecionado}
                                            noOptionsMessage={() =>
                                                clienteBusca.length < 3
                                                    ? "Digite pelo menos 3 letras"
                                                    : "Nenhum cliente encontrado"
                                            }

                                        />
                                        {erros.cliente && <div className="invalid-feedback">{erros.cliente}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="descricaoProblema">
                                        <Form.Label>Descrição do Problema:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            className={`fomr-control ${erros.descricaoProblema ? 'is-invalid' : ''}`}
                                            name="descricaoProblema"
                                            value={descricaoProblema}
                                            onChange={(e) => setDescricaoProblema(e.target.value)}
                                            rows={8}
                                            style={{ resize: 'none' }}
                                            placeholder="Descreva o problema aqui..."

                                        />
                                        {erros.descricaoProblema && <div className="invalid-feedback">{erros.descricaoProblema}</div>}
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="servicoRealizado">
                                        <Form.Label>Serviços Realizados:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            className={`fomr-control ${erros.servicoRealizado ? 'is-invalid' : ''}`}
                                            name="servicoRealizado"
                                            value={servicoRealizado}
                                            onChange={(e) => setServicoRealizado(e.target.value)}
                                            rows={8}
                                            style={{ resize: 'none' }}
                                            placeholder="Informe os serviços realizados..."
                                        />
                                        {erros.servicoRealizado && <div className="invalid-feedback">{erros.servicoRealizado}</div>}
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="observacoes">
                                        <Form.Label>Observações:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="observacoes"
                                            value={observacoes}
                                            onChange={(e) => setObservacoes(e.target.value)}
                                            rows={8}
                                            style={{ resize: 'none' }}
                                            placeholder="Alguma observação adicional?"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={7}>
                                    <Form.Group controlId="formFuncionario" className="mb-3">
                                        <Form.Label>Técnico Responsável:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            className={`fomr-control ${erros.funcionarioID ? 'is-invalid' : ''}`}
                                            name="funcionarioID"
                                            value={funcionarioID}
                                            onChange={(e) => setFuncionarioID(e.target.value)}

                                        >
                                            <option value="" disabled>Selecione um Funcionário</option>
                                            {funcionarios.map((funcionario) => (
                                                <option key={funcionario.id} value={funcionario.id}>
                                                    {funcionario.nome}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        {erros.funcionarioID && <div className="invalid-feedback">{erros.funcionarioID}</div>}
                                    </Form.Group>
                                </Col>

                                <Col sm={5}>
                                    <Form.Group controlId="formValor" className="mb-3">
                                        <Form.Label>Valor dos Serviços Realizados:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            inputMode="numeric"
                                            className={`fomr-control ${erros.valor ? 'is-invalid' : ''}`}
                                            value={formatarMoeda(valor)}
                                            onChange={(e) => {
                                                const valorNumerico = parseFloat(
                                                    e.target.value.replace(/\D/g, "")
                                                ) / 100;

                                                if (!isNaN(valorNumerico) && valorNumerico >= 0) {
                                                    setValor(valorNumerico);
                                                }
                                            }}
                                        />
                                        {erros.valor && <div className="invalid-feedback">{erros.valor}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="success" type="submit" className={style.btn} disabled={loading}>
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
