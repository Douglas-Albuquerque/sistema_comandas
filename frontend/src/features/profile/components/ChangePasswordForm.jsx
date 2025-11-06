import { useState } from 'react';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './ChangePasswordForm.css';

const ChangePasswordForm = ({ onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.current_password) {
            newErrors.current_password = 'Senha atual é obrigatória';
        }

        if (!formData.new_password) {
            newErrors.new_password = 'Nova senha é obrigatória';
        } else if (formData.new_password.length < 6) {
            newErrors.new_password = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (formData.new_password !== formData.new_password_confirmation) {
            newErrors.new_password_confirmation = 'As senhas não conferem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="change-password-form">
            <div className="form-row">
                <Input
                    type="password"
                    name="current_password"
                    placeholder="Senha atual"
                    value={formData.current_password}
                    onChange={handleChange}
                    error={errors.current_password}
                    icon="🔒"
                    disabled={loading}
                />
            </div>

            <div className="form-row">
                <Input
                    type="password"
                    name="new_password"
                    placeholder="Nova senha"
                    value={formData.new_password}
                    onChange={handleChange}
                    error={errors.new_password}
                    icon="🔑"
                    disabled={loading}
                />
            </div>

            <div className="form-row">
                <Input
                    type="password"
                    name="new_password_confirmation"
                    placeholder="Confirmar nova senha"
                    value={formData.new_password_confirmation}
                    onChange={handleChange}
                    error={errors.new_password_confirmation}
                    icon="🔑"
                    disabled={loading}
                />
            </div>

            <div className="form-actions">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={loading}
                >
                    Alterar Senha
                </Button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
