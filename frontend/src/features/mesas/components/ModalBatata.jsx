import React, { useState, useContext } from 'react';
import { ToastContext } from '../../../context/ToastContext';
import './ModalBatata.css';

const ModalBatata = ({ produto, isOpen, onClose, onConfirm, loading = false }) => {
    const [tamanho, setTamanho] = useState('pequeno');
    const [quantidade, setQuantidade] = useState(1);
    const [observacoes, setObservacoes] = useState('');

    const { showSuccess, showError, showWarning } = useContext(ToastContext);

    const tamanhos = {
        pequeno: { label: 'Pequena', preco: 7.00 },
        medio: { label: 'Média', preco: 10.00 },
        grande: { label: 'Grande', preco: 15.00 },
    };

    const precoAtual = tamanhos[tamanho].preco;

    const handleConfirm = () => {
        // Validação de quantidade
        if (quantidade < 1) {
            showWarning('A quantidade deve ser maior que zero!');
            return;
        }

        if (quantidade > 50) {
            showWarning('Quantidade máxima é 50 unidades!');
            return;
        }

        // Validação de tamanho
        if (!tamanho) {
            showError('Selecione um tamanho!');
            return;
        }

        try {
            // Monta a observação corretamente com o tamanho atual
            const obsCompleta = observacoes 
                ? `Tamanho: ${tamanhos[tamanho].label}\n${observacoes}`
                : `Tamanho: ${tamanhos[tamanho].label}`;

            onConfirm({
                quantidade: parseInt(quantidade),
                observacoes: obsCompleta,
                preco: precoAtual,
            });

            // Feedback de sucesso
            showSuccess(`${produto.nome} adicionado com sucesso!`);

            // Resetar campos
            setTamanho('pequeno');
            setQuantidade(1);
            setObservacoes('');

        } catch (error) {
            showError('Erro ao adicionar produto. Tente novamente!');
            console.error('Erro ao confirmar:', error);
        }
    };

    const handleClose = () => {
        if (loading) return;

        // Resetar campos ao fechar
        setTamanho('pequeno');
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
                    <button
                        className="btn-close"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {/* Tamanho */}
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
                                    <span className="tamanho-label">{value.label}</span>
                                    <span className="tamanho-preco">R$ {value.preco.toFixed(2)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantidade */}
                    <div className="form-group">
                        <label>Quantidade *</label>
                        <div className="quantidade-input">
                            <button
                                type="button"
                                className="btn-qty"
                                onClick={handleDecrement}
                                disabled={loading}
                            >
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
                            <button
                                type="button"
                                className="btn-qty"
                                onClick={handleIncrement}
                                disabled={loading}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Observações */}
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

                    {/* Prévia do Total */}
                    <div className="total-preview">
                        <div>
                            <div>Tamanho: {tamanhos[tamanho].label}</div>
                            <div>Quantidade: {quantidade}</div>
                        </div>
                        <div className="total">
                            R$ {(precoAtual * quantidade).toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn-cancelar"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn-confirmar"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Adicionando...' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalBatata;
