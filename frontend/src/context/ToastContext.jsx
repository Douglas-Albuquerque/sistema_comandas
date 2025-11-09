import { createContext, useState, useCallback } from 'react';
import ToastContainer from '../components/common/Toast/ToastContainer';

export const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = toastId++;
        const toast = { id, message, type, duration };

        setToasts((prevToasts) => [...prevToasts, toast]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message) => {
        addToast(message, 'success');
    }, [addToast]);

    const showError = useCallback((message) => {
        addToast(message, 'error', 5000);
    }, [addToast]);

    const showWarning = useCallback((message) => {
        addToast(message, 'warning', 4000);
    }, [addToast]);

    const showInfo = useCallback((message) => {
        addToast(message, 'info');
    }, [addToast]);

    return (
        <ToastContext.Provider
            value={{
                showSuccess,
                showError,
                showWarning,
                showInfo,
            }}
        >
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};
