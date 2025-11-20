import React, { useState } from 'react';
import './ModalSimples.css';

const ModalSimples = ({ produto, isOpen, onClose, onConfirm }) => {
    const [quantidade, setQuantidade] = useState(1);
    const [observacoes, setObservacoes] = useState('');

    const handleConfirm = () => {
        onConfirm({
            quantidade: parseInt(quantidade),
            observacoes,
        });
        setQuantidade(1);
        setObservacoes('');
    };

    if (!isOpen || !produto) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{produto.nome}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {produto.descricao && (
                        <p className="produto-descricao">{produto.descricao}</p>
                    )}

                    <div className="preco-info">
                        <span className="label">Preço:</span>
                        <span className="preco">R$ {parseFloat(produto.preco).toFixed(2)}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantidade">Quantidade:</label>
                        <div className="quantidade-input">
                            <button
                                className="btn-qty"
                                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                            >
                                −
                            </button>
                            <input
                                id="quantidade"
                                type="number"
                                min="1"
                                value={quantidade}
                                onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                            <button
                                className="btn-qty"
                                onClick={() => setQuantidade(quantidade + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="observacoes">Observações:</label>
                        <textarea
                            id="observacoes"
                            placeholder="Ex: Sem cebola, sem tomate, etc..."
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div className="total-preview">
                        <span>Subtotal:</span>
                        <span className="total">
                            R$ {(parseFloat(produto.preco) * quantidade).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancelar" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn-confirmar" onClick={handleConfirm}>
                        Adicionar à Comanda
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSimples;
