import { useEffect, useState } from "react";
import { Container, Spinner, Button } from 'react-bootstrap';
import { Clipboard2Plus, PersonPlus, Tools, People } from 'react-bootstrap-icons';
import { ExclamationCircle, HourglassSplit, XCircle, CheckCircle, Clock } from 'react-bootstrap-icons';
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Home.module.css";
import OrdemServicoAPI from "../../services/ordemServicoAPI";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const STATUS_ENUM = [
    { id: 1, nome: "ABERTA(S)" },
    { id: 2, nome: "EM ANDAMENTO" },
    { id: 3, nome: "CANCELADA(S)" },
    { id: 4, nome: "CONCLUÍDA(S)" },
    { id: 5, nome: "PENDENTE(S)" }
];

const STATUS_CONFIG = {
    "ABERTA(S)": {
        cor: '#0d6efd', // Azul
        icone: <ExclamationCircle size={32} color="#0d6efd" />
    },
    "EM ANDAMENTO": {
        cor: '#ffc107', // Amarelo
        icone: <HourglassSplit size={32} color="#ffc107" />
    },
    "CANCELADA(S)": {
        cor: '#dc3545', // Vermelho
        icone: <XCircle size={32} color="#dc3545" />
    },
    "CONCLUÍDA(S)": {
        cor: '#198754', // Verde
        icone: <CheckCircle size={32} color="#198754" />
    },
    "PENDENTE(S)": {
        cor: '#fd7e14', // Laranja
        icone: <Clock size={32} color="#fd7e14" />
    }
};

export function Home() {
    const [colapsada, setColapsada] = useState(false);
    const [contagem, setContagem] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const buscarOrdens = async () => {
            try {
                const resposta = await OrdemServicoAPI.listarAsync(true); // ajuste o nome da função se necessário
                const todasOrdens = resposta;

                // Inicializa o contador para todos os status
                const resumo = {};
                STATUS_ENUM.forEach(status => {
                    resumo[status.nome] = 0;
                });

                // Conta quantas ordens tem por status (baseado no ID)
                todasOrdens.forEach(ordem => {
                    const statusEncontrado = STATUS_ENUM.find(s => s.id === ordem.statusOSID);
                    if (statusEncontrado) {
                        resumo[statusEncontrado.nome]++;
                    }
                });

                setContagem(resumo);
            } catch (erro) {
                console.error("Erro ao buscar ordens:", erro);
            } finally {
                setLoading(false);
            }
        };

        buscarOrdens();
    }, []);

    const botoesAtalho = [
        { texto: 'Nova Ordem', icone: <Clipboard2Plus />, rota: '/ordens/nova', cor: 'primary' },
        { texto: 'Cadastrar Cliente', icone: <PersonPlus />, rota: '/clientes/novo', cor: 'success' },
        { texto: 'Funcionários', icone: <Tools />, rota: '/funcionarios', cor: 'warning' },
        { texto: 'Clientes', icone: <People />, rota: '/clientes', cor: 'info' },
    ];

    if (loading) {
        return (
            <Container className="text-center p-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (



        <div className={style.conteudo}>          
            <Sidebar colapsada={colapsada} setColapsada={setColapsada}>
                <Topbar colapsada={colapsada}>
                    <div className={style.pagina_conteudo}>
                        <Container fluid className="p-4">
                            <h2 className="mb-4">Ordens de Serviço:</h2>

                            <div className="d-flex justify-content-between flex-wrap" style={{ gap: '1rem' }}>
                                {STATUS_ENUM.map(({ id, nome }) => {
                                    const config = STATUS_CONFIG[nome];

                                    return (
                                        <motion.div
                                            key={id}
                                            style={{ flex: '1 1 calc(20% - 1rem)', minWidth: '200px' }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: id * 0.05 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <div
                                                className="shadow-sm h-100 rounded p-3 text-center"
                                                style={{
                                                    backgroundColor: `${config.cor}20`,
                                                    transition: 'box-shadow 0.2s ease-in-out',
                                                    cursor: 'default'
                                                }}
                                            >
                                                <div className="mb-2">{config.icone}</div>
                                                <h5 style={{ color: config.cor }}>{nome}</h5>
                                                <div style={{ fontSize: '2rem', color: config.cor }}>
                                                    {contagem[nome]}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <h4 className="my-4">Atalhos rápidos</h4>
                            <div className="row">
                                {botoesAtalho.map(({ texto, icone, rota, cor }) => (
                                    <div className="col-md-3 col-sm-6 mb-3" key={texto}>
                                        <Button
                                            variant={cor}
                                            className="w-100 d-flex align-items-center justify-content-center gap-2 p-3 shadow-sm"
                                            onClick={() => navigate(rota)}
                                        >
                                            {icone} {texto}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Container>
                    </div>
                </Topbar>
            </Sidebar>
        </div>
    );
}

