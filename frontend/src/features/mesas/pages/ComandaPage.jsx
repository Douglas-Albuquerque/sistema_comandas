import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
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

    const [comanda, setComanda] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [tipoModal, setTipoModal] = useState(null);

    const mesa = location.state?.mesa;
    const token = localStorage.getItem('token');

    // Buscar comanda e produtos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [comandaRes, produtosRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/mesas/${mesaId}/comanda`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:8000/api/produtos', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (!comandaRes.ok || !produtosRes.ok) {
                    throw new Error('Erro ao carregar dados');
                }

                const comandaData = await comandaRes.json();
                const produtosData = await produtosRes.json();

                setComanda(comandaData.comanda);
                setProdutos(produtosData.produtos);

                // Agrupar produtos por categoria
                const categoriaMap = {};
                produtosData.produtos.forEach(produto => {
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

                // Ordenar categorias conforme solicitado
                const ordemCategorias = [
                    'entradas',
                    'sanduiches-arabe',
                    'sanduiches-bola',
                    'sanduiches-artesanal',
                    'pasteis',
                    'bebidas'
                ];

                const categoriasOrdenadas = ordemCategorias
                    .map(slug => categoriaMap[slug])
                    .filter(cat => cat !== undefined);

                setCategorias(categoriasOrdenadas);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Erro ao carregar comanda ou produtos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mesaId, token]);

    // Determinar qual modal usar baseado na categoria
    const getModalType = (slug) => {
        switch (slug) {
            case 'entradas':
                return 'batata';
            case 'pasteis':
                return 'pastel';
            case 'bebidas':
                return 'bebida';
            case 'sanduiches-arabe':
            case 'sanduiches-bola':
            case 'sanduiches-artesanal':
                return 'simples';
            default:
                return 'simples';
        }
    };

    // Abrir modal ao clicar em um produto
    const handleProdutoClick = (produto) => {
        setProdutoSelecionado(produto);
        const tipo = getModalType(produto.categoria.slug);
        setTipoModal(tipo);
        setModalOpen(true);
    };

    // Adicionar item à comanda
    const handleAdicionarItem = async (dados) => {
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

            // Recarregar comanda
            const comandaRes = await fetch(
                `http://localhost:8000/api/mesas/${mesaId}/comanda`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const comandaData = await comandaRes.json();
            setComanda(comandaData.comanda);

            setModalOpen(false);
            setProdutoSelecionado(null);
            setTipoModal(null);
        } catch (err) {
            console.error('Erro:', err);
            alert('Erro ao adicionar item');
        }
    };

    // Remover item da comanda
    const handleRemoverItem = async (itemId) => {
        if (!window.confirm('Deseja remover este item?')) return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/itens/${itemId}`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );

            if (!response.ok) throw new Error('Erro ao remover item');

            // Recarregar comanda
            const comandaRes = await fetch(
                `http://localhost:8000/api/mesas/${mesaId}/comanda`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const comandaData = await comandaRes.json();
            setComanda(comandaData.comanda);
        } catch (err) {
            console.error('Erro:', err);
            alert('Erro ao remover item');
        }
    };

    // Enviar para cozinha
    const handleEnviarCozinha = async () => {
        if (!comanda.items || comanda.items.length === 0) {
            alert('Adicione itens à comanda antes de enviar');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/comandas/${comanda.id}/enviar-cozinha`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );

            if (!response.ok) throw new Error('Erro ao enviar comanda');

            const comandaRes = await fetch(
                `http://localhost:8000/api/mesas/${mesaId}/comanda`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const comandaData = await comandaRes.json();
            setComanda(comandaData.comanda);
            alert('Comanda enviada para a cozinha!');
        } catch (err) {
            console.error('Erro:', err);
            alert('Erro ao enviar comanda');
        }
    };

    // Fechar comanda
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

            alert('Comanda fechada!');
            navigate('/mesas');
        } catch (err) {
            console.error('Erro:', err);
            alert('Erro ao fechar comanda');
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
            {/* Renderizar modal apropriado */}
            {tipoModal === 'batata' && (
                <ModalBatata
                    produto={produtoSelecionado}
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setProdutoSelecionado(null);
                        setTipoModal(null);
                    }}
                    onConfirm={handleAdicionarItem}
                />
            )}

            {tipoModal === 'pastel' && (
                <ModalPastel
                    produto={produtoSelecionado}
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setProdutoSelecionado(null);
                        setTipoModal(null);
                    }}
                    onConfirm={handleAdicionarItem}
                />
            )}

            {tipoModal === 'bebida' && (
                <ModalBebida
                    produto={produtoSelecionado}
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setProdutoSelecionado(null);
                        setTipoModal(null);
                    }}
                    onConfirm={handleAdicionarItem}
                />
            )}

            {tipoModal === 'simples' && (
                <ModalSimples
                    produto={produtoSelecionado}
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setProdutoSelecionado(null);
                        setTipoModal(null);
                    }}
                    onConfirm={handleAdicionarItem}
                />
            )}

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
                {/* Coluna esquerda - Categorias e Produtos */}
                <div className="produtos-section">
                    <h2>Cardápio</h2>

                    {categorias.map((categoria) => (
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
                    ))}
                </div>

                {/* Coluna direita - Comanda */}
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

                    {/* Total e Ações */}
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
                                >
                                    🍳 Enviar para Cozinha
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
