import './CardPedido.css'
import { getPedidosItensUsuarioLogado } from '../apiService';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import axios from 'axios'
import ModalDadosEntrega from './ModalDadosEntrega';
import { FaTruck } from 'react-icons/fa'

function CardPedido() {
    const { userLogado } = useContext(GlobalContext);
    const [pedidosItens, setPedidosItens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [tipoConta, setTipoConta] = useState(null);
    const [estatisticas, setEstatisticas] = useState(null);
    const [statusMaquinas, setStatusMaquinas] = useState({});
    const [loadingMaquinas, setLoadingMaquinas] = useState(new Set());
    const [modalDadosOpen, setModalDadosOpen] = useState(false)
    const [pedidoSelecionado, setPedidoSelecionado] = useState({})

    const getStatusMaquina = async (id_maquina) => {
        try {
            const response = await axios.get(
                `http://52.1.197.112:3000/queue/items/${id_maquina}`,
                {
                    timeout: 10000,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;

        } catch (error) {
            console.error(`Erro ao buscar status da máquina ${id_maquina}:`, error);
            return 'Indisponível';
        }
    };

    const carregarStatusMaquina = async (id_maquina) => {
        if (loadingMaquinas.has(id_maquina) || statusMaquinas[id_maquina]) {
            return;
        }

        try {
            setLoadingMaquinas(prev => new Set(prev).add(id_maquina));

            const status = await getStatusMaquina(id_maquina);

            setStatusMaquinas(prev => ({
                ...prev,
                [id_maquina]: status
            }));

        } catch (error) {
            console.error(`Erro ao carregar status da máquina ${id_maquina}:`, error);

            setStatusMaquinas(prev => ({
                ...prev,
                [id_maquina]: 'Erro'
            }));

        } finally {
            setLoadingMaquinas(prev => {
                const newSet = new Set(prev);
                newSet.delete(id_maquina);
                return newSet;
            });
        }
    };

    const getStatusClass = (status) => {
        if (typeof status === 'object' && status.status) {
            switch (status.status.toLowerCase()) {
                case 'pending': return 'pendente';
                case 'processing': return 'producao';
                case 'completed': return 'completo';
                default: return 'unknown';
            }
        }
        return 'unknown';
    };

    const getStatusTexto = (status) => {
        if (typeof status === 'object' && status.status) {
            switch (status.status.toLowerCase()) {
                case 'pending': return 'PENDENTE';
                case 'processing': return 'EM PRODUÇÃO';
                case 'completed': return 'COMPLETO';
                default: return 'DESCONHECIDO';
            }
        }
        if (typeof status === 'string') {
            return status.toUpperCase();
        }
        return 'DESCONHECIDO';
    };

    useEffect(() => {
        const fetchPedidosItens = async () => {
            try {
                setLoading(true);
                setErro(null);

                if (!userLogado?.id_usuario && !userLogado?.id_ong) {
                    console.log('Usuário não logado ou sem ID válido');
                    setPedidosItens([]);
                    setLoading(false);
                    return;
                }

                console.log('Buscando itens de pedidos do usuário logado:', userLogado);

                const data = await getPedidosItensUsuarioLogado(userLogado);

                console.log('Dados recebidos:', data);

                if (data && Array.isArray(data.itens_por_pedido)) {
                    setPedidosItens(data.itens_por_pedido);
                    setTipoConta(data.tipo_conta);
                    setEstatisticas(data.estatisticas);

                    const maquinasUnicas = new Set();
                    data.itens_por_pedido.forEach(pedido => {
                        pedido.itens.forEach(item => {
                            if (item.id_maquina) {
                                maquinasUnicas.add(item.id_maquina);
                            }
                        });
                    });

                    maquinasUnicas.forEach(id_maquina => {
                        carregarStatusMaquina(id_maquina);
                    });

                } else {
                    console.warn('Estrutura de dados inesperada:', data);
                    setPedidosItens([]);
                }

            } catch (error) {
                console.error("Erro ao buscar itens de pedidos:", error);
                setErro(error.message);
                setPedidosItens([]);
            } finally {
                setLoading(false);
            }
        };

        if (userLogado) {
            fetchPedidosItens();
        }
    }, [userLogado]);

    return (
        <div className="container-card-pedidos">
            {pedidosItens.length === 0 && (
                <p className='sem-pedidos'>Você ainda não fez nenhum pedido.</p>
            )}
            {estatisticas && (
                <div className="estatisticas-pedidos">
                    <h2>Seus Pedidos</h2>
                    <div className="stats-grid">
                        <div className="stat-card aguardando">
                            <span className="numero">{estatisticas.aguardando_producao}</span>
                            <span className="label">Aguardando</span>
                        </div>
                        <div className="stat-card producao">
                            <span className="numero">{estatisticas.em_producao}</span>
                            <span className="label">Em Produção</span>
                        </div>
                        <div className="stat-card finalizado">
                            <span className="numero">{estatisticas.finalizado}</span>
                            <span className="label">Finalizados</span>
                        </div>
                        <div className="stat-card total">
                            <span className="numero">{estatisticas.total}</span>
                            <span className="label">Total</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="lista-pedidos">
                {pedidosItens
                    .sort((a, b) => new Date(b.data_pedido) - new Date(a.data_pedido))
                    .map((pedido) => (
                        <div key={pedido.id_pedido} className="card-pedido">
                            <div className="pedido-header">
                                <h3>Pedido #{pedido.id_pedido}</h3>
                                <div className="pedido-info">
                                    <span className={`status-badge ${pedido.status_pedido}`}>
                                        {pedido.status_pedido}
                                    </span>
                                    <span className="data-pedido">
                                        {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                                    </span>
                                    <span className="valor-total">
                                        R$ {parseFloat(pedido.valor_total_pedido || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="pedido-itens">
                                <h4>Itens ({pedido.itens.length})</h4>
                                <div className={`itens-grid ${pedido.itens.length === 1 ? 'single' : ''}`}>
                                    {pedido.itens.map((item) => (
                                        <div key={item.id_item_pedido} className="item-card">
                                            <div className="item-imagem">
                                                <img
                                                    src={item.imagem || '/placeholder-coleira.png'}
                                                    alt={`${item.modelo} ${item.tamanho}`}
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-coleira.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="item-detalhes">
                                                <h5>{item.modelo} - {item.tamanho}</h5>
                                                <div className="item-specs">
                                                    <span>Tecido: {item.cor_tecido}</span>
                                                    <span>Logo: {item.cor_logo}</span>
                                                    <span>Argola: {item.cor_argola}</span>
                                                    <span>Presilha: {item.cor_presilha}</span>
                                                </div>
                                                <div className="item-status-valor">
                                                    {/* <span className={`status-producao ${item.status}`}>
                                                        {item.status.replace('_', ' ')}
                                                    </span> */}
                                                    <span className="item-valor">
                                                        R$ {parseFloat(item.valor).toFixed(2)}
                                                    </span>
                                                </div>
                                                {item.id_maquina && (
                                                    <div className={`item-maquina ${getStatusClass(statusMaquinas[item.id_maquina])}`}>
                                                        ID Máquina: {item.id_maquina}
                                                        <div className="maquina-status">
                                                            Status: {
                                                                loadingMaquinas.has(item.id_maquina) ? (
                                                                    <span className="loading-status">Carregando...</span>
                                                                ) : statusMaquinas[item.id_maquina] ? (
                                                                    <span className={`status-maquina ${getStatusClass(statusMaquinas[item.id_maquina])}`}>
                                                                        {getStatusTexto(statusMaquinas[item.id_maquina])}
                                                                    </span>
                                                                ) : (
                                                                    <span className="status-desconhecido">Desconhecido</span>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {pedido && (
                                <div className="pedido-entrega">
                                    <button
                                        className='botao-info-entrega'
                                        onClick={() => { setModalDadosOpen(true); setPedidoSelecionado(pedido) }}
                                     >
                                        Informações de Entrega
                                        <FaTruck />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <ModalDadosEntrega
                        isOpen={modalDadosOpen}
                        setIsOpen={setModalDadosOpen}
                        pedido={pedidoSelecionado}
                    />
            </div>
        </div>
    );
}

export default CardPedido;