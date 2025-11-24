import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { ToastContext } from '../../../context/ToastContext';
import Spinner from '../../../components/common/Spinner/Spinner';
import ModalBatata from '../components/ModalBatata';
import ModalPastel from '../components/ModalPastel';
import ModalBebida from '../components/ModalBebidas';
import ModalSimples from '../components/ModalSimples';
import './ComandaPage.css';

const ComandaPage = () => {
    const { mesaId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const { showSuccess, showError, showWarning } = useContext(ToastContext);

    const [comanda, setComanda] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingProdutos, setLoadingProdutos] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [tipoModal, setTipoModal] = useState(null);
    const [itemParaRemover, setItemParaRemover] = useState(null);
    const [adicionandoItem, setAdicionandoItem] = useState(false);
    const [enviandoCozinha, setEnviandoCozinha] = useState(false);

    const mesa = location.state?.mesa;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cachedProdutos = sessionStorage.getItem('produtos_cache');
                if (cachedProdutos) {
                    setProdutos(JSON.parse(cachedProdutos));
                    setLoadingProdutos(false);
                }

                const comandaPromise = fetch(`http://localhost:8000/api/mesas/${mesaId}/comanda`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const produtosPromise = fetch('http://localhost:8000/api/produtos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const comandaRes = await comandaPromise;
                if (!comandaRes.ok) throw new Error('Erro ao carregar comanda');

                const comandaData = await comandaRes.json();
                setComanda(comandaData.comanda);
                setLoading(false);

                const produtosRes = await produtosPromise;
                if (!produtosRes.ok) throw new Error('Erro ao carregar produtos');

                const produtosData = await produtosRes.json();
                setProdutos(produtosData.produtos);
                setLoadingProdutos(false);

                sessionStorage.setItem('produtos_cache', JSON.stringify(produtosData.produtos));

            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Erro ao carregar comanda ou produtos');
                showError('Erro ao carregar dados da comanda');
                setLoading(false);
                setLoadingProdutos(false);
            }
        };

        fetchData();
    }, [mesaId, token]);

    const categorias = useMemo(() => {
        if (produtos.length === 0) return [];

        const categoriaMap = {};
        produtos.forEach(produto => {
            if (!categoriaMap[produto.categoria.slug]) {
                categoriaMap[produto.categoria.slug] = {
                    id: produto.categoria.id,
                    nome: produto.categoria.nome,
                    slug: produto.categoria.slug,
                    produtos: []
                };
            }
            categoriaMap[produto.categoria.slug].produtos.push(produto);
        });

        const ordemCategorias = [
            'entradas',
            'sanduiches-arabe',
            'sanduiches-bola',
            'sanduiches-artesanal',
            'pasteis',
            'bebidas'
        ];

        return ordemCategorias
            .map(slug => categoriaMap[slug])
            .filter(cat => cat !== undefined);
    }, [produtos]);

    const getModalType = (slug) => {
        switch (slug) {
            case 'entradas': return 'batata';
            case 'pasteis': return 'pastel';
            case 'bebidas': return 'bebida';
            case 'sanduiches-arabe':
            case 'sanduiches-bola':
            case 'sanduiches-artesanal': return 'simples';
            default: return 'simples';
        }
    };

    const handleProdutoClick = (produto) => {
        setProdutoSelecionado(produto);
        const tipo = getModalType(produto.categoria.slug);
        setTipoModal(tipo);
        setModalOpen(true);
    };

    const handleAdicionarItem = async (dados) => {
        setAdicionandoItem(true);

        try {
            const response = await fetch(
                `http://localhost:8000/api/comandas/${comanda.id}/itens`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        produto_id: produtoSelecionado.id,
                        quantidade: dados.quantidade,
                        observacoes: dados.observacoes,
                        preco_unitario: dados.preco || parseFloat(produtoSelecionado.preco),
                    }),
                }
            );

            if (!response.ok) throw new Error('Erro ao adicionar item');

            const resultado = await response.json();

            setComanda(prevComanda => {
                const novoItem = resultado.item || {
                    id: Date.now(),
                    produto: produtoSelecionado,
                    quantidade: dados.quantidade,
                    observacoes: dados.observacoes,
                    preco_unitario: dados.preco || parseFloat(produtoSelecionado.preco),
                    subtotal: (dados.preco || parseFloat(produtoSelecionado.preco)) * dados.quantidade,
                    status: 'pendente'
                };

                return {
                    ...prevComanda,
                    items: [...(prevComanda.items || []), novoItem],
                    total: (parseFloat(prevComanda.total || 0) + parseFloat(novoItem.subtotal)).toFixed(2)
                };
            });

            setModalOpen(false);
            setProdutoSelecionado(null);
            setTipoModal(null);

            fetch(`http://localhost:8000/api/mesas/${mesaId}/comanda`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setComanda(data.comanda))
                .catch(err => console.error('Erro ao sincronizar:', err));

        } catch (err) {
            console.error('Erro:', err);
            showError('Erro ao adicionar item à comanda');
        } finally {
            setAdicionandoItem(false);
        }
    };

    const handleRemoverItem = (itemId) => {
        setItemParaRemover(itemId);
    };

    const confirmarRemocao = async () => {
        if (!itemParaRemover) return;

        try {
            const itemRemovido = comanda.items.find(item => item.id === itemParaRemover);

            if (!itemRemovido) {
                showError('Item não encontrado!');
                setItemParaRemover(null);
                return;
            }

            setComanda(prevComanda => ({
                ...prevComanda,
                items: prevComanda.items.filter(item => item.id !== itemParaRemover),
                total: (parseFloat(prevComanda.total || 0) - parseFloat(itemRemovido.subtotal)).toFixed(2)
            }));

            setItemParaRemover(null);
            showSuccess('Item removido da comanda!');

            const response = await fetch(
                `http://localhost:8000/api/itens/${itemParaRemover}`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );

            if (!response.ok) throw new Error('Erro ao remover item');

            fetch(`http://localhost:8000/api/mesas/${mesaId}/comanda`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setComanda(data.comanda))
                .catch(err => console.error('Erro ao sincronizar:', err));

        } catch (err) {
            console.error('Erro:', err);
            showError('Erro ao remover item da comanda');

            fetch(`http://localhost:8000/api/mesas/${mesaId}/comanda`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setComanda(data.comanda))
                .catch(err => console.error('Erro ao recarregar:', err));
        }
    };

    const cancelarRemocao = () => {
        setItemParaRemover(null);
    };

    const handleEnviarCozinha = async () => {
        if (!comanda.items || comanda.items.length === 0) {
            showWarning('Adicione itens à comanda antes de enviar!');
            return;
        }

        if (enviandoCozinha) return;

        setEnviandoCozinha(true);

        try {
            setComanda(prevComanda => ({
                ...prevComanda,
                status: 'enviada_cozinha'
            }));

            showSuccess('Comanda enviada para a cozinha!');

            const response = await fetch(
                `http://localhost:8000/api/comandas/${comanda.id}/enviar-cozinha`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );

            if (!response.ok) throw new Error('Erro ao enviar comanda');

            fetch(`http://localhost:8000/api/mesas/${mesaId}/comanda`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setComanda(data.comanda))
                .catch(err => console.error('Erro ao sincronizar:', err));

        } catch (err) {
            console.error('Erro:', err);
            showError('Erro ao enviar comanda para a cozinha');

            fetch(`http://localhost:8000/api/mesas/${mesaId}/comanda`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setComanda(data.comanda))
                .catch(err => console.error('Erro ao recarregar:', err));
        } finally {
            setEnviandoCozinha(false);
        }
    };

    const handleFecharComanda = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/comandas/${comanda.id}/fechar`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        desconto: 0,
                        taxa_servico: 0,
                    }),
                }
            );

            if (!response.ok) throw new Error('Erro ao fechar comanda');

            showSuccess('Comanda fechada com sucesso!');

            setTimeout(() => {
                navigate('/mesas');
            }, 1500);
        } catch (err) {
            console.error('Erro:', err);
            showError('Erro ao fechar comanda');
        }
    };

    const renderModal = () => {
        if (!modalOpen || !produtoSelecionado) return null;

        const modalProps = {
            produto: produtoSelecionado,
            isOpen: modalOpen,
            onClose: () => {
                setModalOpen(false);
                setProdutoSelecionado(null);
                setTipoModal(null);
            },
            onConfirm: handleAdicionarItem,
            loading: adicionandoItem
        };

        switch (tipoModal) {
            case 'batata': return <ModalBatata {...modalProps} />;
            case 'pastel': return <ModalPastel {...modalProps} />;
            case 'bebida': return <ModalBebida {...modalProps} />;
            case 'simples': return <ModalSimples {...modalProps} />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="comanda-page">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    width: '100%',
                }}>
                    <Spinner size="large" text="Carregando comanda..." fullScreen={false} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="comanda-page">
                <div className="error-message">
                    <p>{error}</p>
                    <button className="btn-voltar" onClick={() => navigate('/mesas')}>
                        Voltar para Mesas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="comanda-page">
            {itemParaRemover && (
                <div className="modal-overlay-confirm" onClick={cancelarRemocao}>
                    <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-confirm-icon">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M24 4L44 40H4L24 4Z" fill="#F59E0B" />
                                <path d="M22 18H26V28H22V18Z" fill="white" />
                                <circle cx="24" cy="34" r="2" fill="white" />
                            </svg>
                        </div>
                        <h2 className="modal-confirm-title">Remover Item</h2>
                        <p className="modal-confirm-message">
                            Tem certeza que deseja remover este item da comanda?
                        </p>
                        <div className="modal-confirm-buttons">
                            <button className="btn-confirm-cancelar" onClick={cancelarRemocao}>
                                Cancelar
                            </button>
                            <button className="btn-confirm-remover" onClick={confirmarRemocao}>
                                Sim
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {renderModal()}

            <div className="comanda-header">
                <button className="btn-voltar" onClick={() => navigate('/mesas')}>
                    ←
                </button>
                <h1>Mesa {mesa?.numero}</h1>
                <span className={`status-badge ${comanda.status}`}>
                    {comanda.status}
                </span>
            </div>

            <div className="comanda-container">
                <div className="produtos-section">
                    <h2>Cardápio</h2>

                    {loadingProdutos ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Spinner size="medium" text="Carregando produtos..." />
                        </div>
                    ) : (
                        categorias.map((categoria) => (
                            <div key={categoria.slug} className="categoria-group">
                                <h3 className="categoria-titulo">{categoria.nome}</h3>
                                <div className="produtos-grid">
                                    {categoria.produtos.map((produto) => (
                                        <button
                                            key={produto.id}
                                            className="produto-btn"
                                            onClick={() => handleProdutoClick(produto)}
                                        >
                                            <div className="produto-info">
                                                <div className="produto-nome">{produto.nome}</div>
                                                <div className="produto-preco">
                                                    R$ {parseFloat(produto.preco).toFixed(2)}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="comanda-section">
                    <h2>Comanda #{comanda.id}</h2>

                    {comanda.items && comanda.items.length > 0 ? (
                        <div className="itens-lista">
                            {comanda.items.map((item) => (
                                <div key={item.id} className="item-comanda">
                                    <div className="item-header">
                                        <div className="item-nome">{item.produto.nome}</div>
                                        <button
                                            className="btn-remover"
                                            onClick={() => handleRemoverItem(item.id)}
                                            title="Remover item"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="item-details">
                                        <span className="quantidade">
                                            Qtd: <strong>{item.quantidade}</strong>
                                        </span>
                                        <span className="preco">
                                            R$ {parseFloat(item.preco_unitario).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="item-subtotal">
                                        Subtotal: R$ {parseFloat(item.subtotal).toFixed(2)}
                                    </div>

                                    {item.observacoes && (
                                        <div className="item-observacoes">
                                            <strong>Obs:</strong> {item.observacoes}
                                        </div>
                                    )}

                                    <div className={`item-status ${item.status}`}>
                                        {item.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-message">
                            📭 Nenhum item adicionado
                        </div>
                    )}

                    <div className="comanda-footer">
                        <div className="total-section">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>R$ {parseFloat(comanda.total || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="comanda-acoes">
                            {comanda.status === 'aberta' && (
                                <button
                                    className="btn-enviar-cozinha"
                                    onClick={handleEnviarCozinha}
                                    disabled={enviandoCozinha}
                                >
                                    {enviandoCozinha ? '⏳ Enviando...' : '🍳 Enviar para Cozinha'}
                                </button>
                            )}

                            {(user.role.slug === 'caixa' || user.role.slug === 'admin') && (
                                <button
                                    className="btn-fechar-comanda"
                                    onClick={handleFecharComanda}
                                >
                                    💳 Fechar Comanda
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComandaPage;
