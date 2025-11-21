import React, { useState, useContext } from 'react';
import { ToastContext } from '../../../context/ToastContext';
import './ModalBebida.css';

const ModalBebida = ({ produto, isOpen, onClose, onConfirm, loading = false }) => {
    const [tamanho, setTamanho] = useState('pequeno');
    const [sabor, setSabor] = useState('padrao');
    const [quantidade, setQuantidade] = useState(1);
    const [observacoes, setObservacoes] = useState('');

    const { showSuccess, showError, showWarning } = useContext(ToastContext);

    const tamanhos = {
        pequeno: { label: 'Pequeno', sublabel: '300ml', preco: 0 },
        medio: { label: 'Médio', sublabel: '500ml', preco: 2.00 },
        grande: { label: 'Grande', sublabel: '700ml', preco: 3.00 },
    };

    const sabores = {
        padrao: 'Padrão',
        morango: 'Morango',
        uva: 'Uva',
        maracuja: 'Maracujá',
        laranja: 'Laranja',
        limao: 'Limão',
    };

    const precoBase = parseFloat(produto.preco) || 5.00;
    const precoAtual = precoBase + tamanhos[tamanho].preco;

    const handleConfirm = () => {
        if (quantidade < 1) {
            showWarning('A quantidade deve ser maior que zero!');
            return;
        }

        if (quantidade > 50) {
            showWarning('Quantidade máxima é 50 unidades!');
            return;
        }

        if (!tamanho) {
            showError('Selecione um tamanho!');
            return;
        }

        if (!sabor) {
            showError('Selecione um sabor!');
            return;
        }

        try {
            onConfirm({
                quantidade: parseInt(quantidade),
                observacoes: `Tamanho: ${tamanhos[tamanho].label}\nSabor: ${sabores[sabor]}\n${observacoes}`,
                preco: precoAtual,
            });

            showSuccess(`${produto.nome} adicionado com sucesso!`);

            setTamanho('pequeno');
            setSabor('padrao');
            setQuantidade(1);
            setObservacoes('');

        } catch (error) {
            showError('Erro ao adicionar produto. Tente novamente!');
            console.error('Erro ao confirmar:', error);
        }
    };

    const handleClose = () => {
        if (loading) return;

        setTamanho('pequeno');
        setSabor('padrao');
        setQuantidade(1);
        setObservacoes('');
        onClose();
    };

    const handleIncrement = () => {
        if (quantidade < 50) {
            setQuantidade(prev => prev + 1);
        } else {
            showWarning('Quantidade máxima é 50 unidades!');
        }
    };

    const handleDecrement = () => {
        if (quantidade > 1) {
            setQuantidade(prev => prev - 1);
        } else {
            showWarning('Quantidade mínima é 1 unidade!');
        }
    };

    if (!isOpen || !produto) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{produto.nome}</h2>
                    <button className="btn-close" onClick={handleClose} disabled={loading}>×</button>
                </div>

                <div className="modal-body">
                    <div className="tamanho-section">
                        <label>Selecione o Tamanho *</label>
                        <div className="tamanho-options">
                            {Object.entries(tamanhos).map(([key, value]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`tamanho-btn ${tamanho === key ? 'ativo' : ''}`}
                                    onClick={() => setTamanho(key)}
                                    disabled={loading}
                                >
                                    <span className="tamanho-label">
                                        {value.label}<br />{value.sublabel}
                                    </span>
                                    <span className="tamanho-preco">+R$ {value.preco.toFixed(2)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sabor-section">
                        <label>Selecione o Sabor *</label>
                        <select value={sabor} onChange={(e) => setSabor(e.target.value)} className="sabor-select" disabled={loading}>
                            {Object.entries(sabores).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantidade *</label>
                        <div className="quantidade-input">
                            <button type="button" className="btn-qty" onClick={handleDecrement} disabled={loading}>−</button>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={quantidade}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val >= 1 && val <= 50) setQuantidade(val);
                                }}
                                disabled={loading}
                                readOnly
                            />
                            <button type="button" className="btn-qty" onClick={handleIncrement} disabled={loading}>+</button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Observações</label>
                        <textarea
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            placeholder="Alguma observação especial?"
                            rows="3"
                            maxLength="200"
                            disabled={loading}
                        />
                        <small style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                            {observacoes.length}/200 caracteres
                        </small>
                    </div>

                    <div className="total-preview">
                        <div>
                            <div className="preco-base">Preço base: R$ {precoBase.toFixed(2)}</div>
                            <div>Quantidade: {quantidade}</div>
                        </div>
                        <div className="total">R$ {(precoAtual * quantidade).toFixed(2)}</div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancelar" onClick={handleClose} disabled={loading}>Cancelar</button>
                    <button className="btn-confirmar" onClick={handleConfirm} disabled={loading}>
                        {loading ? 'Adicionando...' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalBebida;
