import style from './NovaOrdemServico.module.css';
import React, { useState, useEffect } from 'react';
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
import 'react-bootstrap-typeahead/css/Typeahead.css';
import OrdemServicoAPI from '../../services/ordemServicoAPI';

export function NovaOrdemServico() {
    const [colapsada, setColapsada] = useState(true);
    const [dataAbertura, setDataAbertura] = useState('');
    const [dataConclusao, setDataConclusao] = useState(null);
    //const [clientes, setClientes] = useState([]);
    //const [clienteID, setClienteID] = useState('');
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
    //const [opcoes, setOpcoes] = useState([]);
    //const [busca, setBusca] = useState("");
    const [erros, setErros] = useState({});
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState(false);


    const navigate = useNavigate();

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

    // Busca dinâmica de clientes com debounce
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
            setClienteOpcoes([]); // limpa opções em caso de erro
        } finally {
            setLoading(false);
        }
    };

    const validar = () => {
        const novosErros = {};
        if (!dataAbertura) novosErros.dataAbertura = "Data de Abertura é obrigatória";
        if (!statusOSID) novosErros.statusOSID = "Selecione um Status para a Ordem de Serviço";
        if (!descricaoProblema.trim()) novosErros.descricaoProblema = "Descrição é obrigatória";
        if (!clienteSelecionado) novosErros.cliente = "Selecione um cliente";
        if (!funcionarioID) novosErros.funcionarioID = "Selecione o técnico responsável";
        return novosErros;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errosValidados = validar();
        if (Object.keys(errosValidados).length > 0) {
            setErros(errosValidados);
            return;
        }

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
            setMensagem("Ordem de Serviço incluída com Sucesso!");
            setErro(false);
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
            console.error(error);
            alert("Erro ao criar ordem de serviço.");
            setMensagem("Erro ao criar ordem de serviço.");
            setErro(true);
        }
    };

    async function fetchFuncionarios() {
        try {
            const listaFuncionarios = await FuncionarioAPI.obterTecnicoAsync();
            setFuncionarios(listaFuncionarios);
        }
        catch (error) {
            console.error("Erro ao carregar funcionarios:", error);
            setMensagem("Erro ao carregar funcionarios:");
            setErro(true);
        }
    }

    async function fetchStatusOS() {
        try {
            const status = await OrdemServicoAPI.listarStatusOS();
            setStatusOS(status);

        } catch (error) {
            console.error("Erro ao listar os status das ordens de serviço:", error);
            setMensagem("Erro ao listar os status das ordens de serviço");
            setErro(true);
        }
    }

    useEffect(() => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
        const dia = String(hoje.getDate()).padStart(2, '0');

        const dataFormatada = `${ano}-${mes}-${dia}`;
        setDataAbertura(dataFormatada);

        //fetchClientes();
        fetchFuncionarios();
        fetchStatusOS();
    }, []);

    return (
        <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
            <Topbar colapsada={colapsada}>
                <div className={style.pagina_conteudo}>
                    <h3>Nova Ordem de Serviço:</h3>
                    <hr></hr>

                    <Form onSubmit={handleSubmit}>
                        {mensagem && (
                            <Alert variant={erro ? "danger" : "success"}>{mensagem}</Alert>
                        )}
                        <Container>
                            <Row>
                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="formData">
                                        <Form.Label>Data de Abertura:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dataAbertura"
                                            value={dataAbertura}
                                            onChange={(e) => setDataAbertura(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="formDataConclusao">
                                        <Form.Label>Data de Conclusão:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dataConclusao"
                                            value={dataConclusao}
                                            onChange={(e) => setDataConclusao(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group className="mb-3" controlId="formStatusOS">
                                        <Form.Label>Status:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="statusOSID"
                                            value={statusOSID}
                                            onChange={(e) => setStatusOSID(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Status da Ordem de Serviço</option>
                                            {statusOS.map((status) => (
                                                <option key={status.id} value={status.id}>
                                                    {status.nome}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>


                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="formCliente">
                                        <Form.Label>Cliente:</Form.Label>
                                        <Select
                                            placeholder="Digite o nome do cliente..."
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
                                            required
                                        />
                                        {erros.cliente && (
                                            <div className="text-danger mt-1">{erros.cliente}</div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="descricaoProblema">
                                        <Form.Label>Descrição do Problema:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="descricaoProblema"
                                            value={descricaoProblema}
                                            onChange={(e) => setDescricaoProblema(e.target.value)}
                                            rows={4}
                                            style={{ resize: 'none' }}
                                            placeholder="Descreva o problema aqui..."
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="servicoRealizado">
                                        <Form.Label>Serviços Realizados:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="servicoRealizado"
                                            value={servicoRealizado}
                                            onChange={(e) => setServicoRealizado(e.target.value)}
                                            rows={4}
                                            style={{ resize: 'none' }}
                                            placeholder="Informe os serviços realizados..."
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3" controlId="observacoes">
                                        <Form.Label>Observações:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="observacoes"
                                            value={observacoes}
                                            onChange={(e) => setObservacoes(e.target.value)}
                                            rows={4}
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
                                            name="funcionarioID"
                                            value={funcionarioID}
                                            onChange={(e) => setFuncionarioID(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Selecione um Funcionário</option>
                                            {funcionarios.map((funcionario) => (
                                                <option key={funcionario.id} value={funcionario.id}>
                                                    {funcionario.nome}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col sm={5}>
                                    <Form.Group controlId="formValor" className="mb-3">
                                        <Form.Label>Valor dos Serviços Realizados:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            inputMode="numeric"
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
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="success" type="submit" className={style.btn}>
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
