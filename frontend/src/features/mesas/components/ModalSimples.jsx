import React, { useState, useContext } from 'react';
import { ToastContext } from '../../../context/ToastContext';
import './ModalSimples.css';

const ModalSimples = ({ produto, isOpen, onClose, onConfirm, loading = false }) => {
    const [quantidade, setQuantidade] = useState(1);
    const [observacoes, setObservacoes] = useState('');

    const { showSuccess, showError, showWarning } = useContext(ToastContext);

    const precoUnitario = parseFloat(produto.preco) || 0;

    const handleConfirm = () => {
        if (quantidade < 1) {
            showWarning('A quantidade deve ser maior que zero!');
            return;
        }

        if (quantidade > 50) {
            showWarning('Quantidade máxima é 50 unidades!');
            return;
        }

        try {
            onConfirm({
                quantidade: parseInt(quantidade),
                observacoes,
            });

            showSuccess(`${produto.nome} adicionado com sucesso!`);

            setQuantidade(1);
            setObservacoes('');

        } catch (error) {
            showError('Erro ao adicionar produto. Tente novamente!');
            console.error('Erro ao confirmar:', error);
        }
    };

    const handleClose = () => {
        if (loading) return;

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
                    <button className="btn-close" onClick={handleClose} disabled={loading}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {produto.descricao && (
                        <p className="produto-descricao">{produto.descricao}</p>
                    )}

                    <div className="preco-info">
                        <span className="label">Preço Unitário:</span>
                        <span className="preco">R$ {precoUnitario.toFixed(2)}</span>
                    </div>

                    <div className="form-group">
                        <label>Quantidade *</label>
                        <div className="quantidade-input">
                            <button type="button" className="btn-qty" onClick={handleDecrement} disabled={loading}>
                                −
                            </button>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={quantidade}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val >= 1 && val <= 50) {
                                        setQuantidade(val);
                                    }
                                }}
                                disabled={loading}
                                readOnly
                            />
                            <button type="button" className="btn-qty" onClick={handleIncrement} disabled={loading}>
                                +
                            </button>
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
                        <span>Total a pagar:</span>
                        <span className="total">R$ {(precoUnitario * quantidade).toFixed(2)}</span>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancelar" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className="btn-confirmar" onClick={handleConfirm} disabled={loading}>
                        {loading ? 'Adicionando...' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSimples;
