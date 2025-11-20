import Toast from './Toast';
import './ToastContainer.css';

const ToastContainer = ({ toasts = [], removeToast }) => {
    // Validação para evitar o erro de undefined
    if (!toasts || !Array.isArray(toasts)) {
        return <div className="toast-container"></div>;
    }

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                    duration={toast.duration}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
