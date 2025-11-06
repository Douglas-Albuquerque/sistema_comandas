import { useState, useEffect } from 'react';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './EditProfileForm.css';

const EditProfileForm = ({ profile, onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                username: profile.username || '',
                email: profile.email || '',
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Usuário é obrigatório';
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
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
        <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-row">
                <Input
                    type="text"
                    name="name"
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    icon="👤"
                    disabled={loading}
                />
            </div>

            <div className="form-row">
                <Input
                    type="text"
                    name="username"
                    placeholder="Nome de usuário"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    icon="@"
                    disabled={loading}
                />
            </div>

            <div className="form-row">
                <Input
                    type="email"
                    name="email"
                    placeholder="E-mail (opcional)"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon="📧"
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
                    Salvar
                </Button>
            </div>
        </form>
    );
};

export default EditProfileForm;
