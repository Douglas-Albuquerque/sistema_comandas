import './ConfirmModal.css';

const ConfirmModal = ({
    isOpen,
    onConfirm,
    onCancel,
    title = 'Confirmar ação',
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    danger = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay" onClick={onCancel}>
            <div className="confirm-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-modal-icon">
                    {danger ? '⚠️' : '❓'}
                </div>

                <div className="confirm-modal-content">
                    <h3 className="confirm-modal-title">{title}</h3>
                    <p className="confirm-modal-message">{message}</p>
                </div>

                <div className="confirm-modal-actions">
                    <button
                        className="confirm-modal-btn btn-cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`confirm-modal-btn ${danger ? 'btn-danger' : 'btn-confirm'}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
