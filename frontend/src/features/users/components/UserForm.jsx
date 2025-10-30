import { useState, useEffect } from 'react';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './UserForm.css';

const UserForm = ({ user, roles, onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        is_active: true,
        inactive_type: 'none', // none, temporary, permanent
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            let inactiveType = 'none';
            if (!user.is_active) {
                inactiveType = user.inactive_until ? 'temporary' : 'permanent';
            }

            setFormData({
                name: user.name,
                username: user.username,
                password: '',
                password_confirmation: '',
                role_id: user.role_id,
                is_active: user.is_active,
                inactive_type: inactiveType,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData({ ...formData, [name]: newValue });

        // Limpar erro do campo ao digitar
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleInactiveTypeChange = (e) => {
        const type = e.target.value;
        setFormData({
            ...formData,
            inactive_type: type,
            is_active: type === 'none'
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username é obrigatório';
        }

        if (!user && !formData.password) {
            newErrors.password = 'Senha é obrigatória';
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'As senhas não conferem';
        }

        if (!formData.role_id) {
            newErrors.role_id = 'Perfil é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Preparar dados para enviar
            const submitData = {
                name: formData.name,
                username: formData.username,
                role_id: formData.role_id,
            };

            // Adicionar senha apenas se preenchida
            if (formData.password) {
                submitData.password = formData.password;
                submitData.password_confirmation = formData.password_confirmation;
            }

            // Calcular status de ativação
            if (formData.inactive_type === 'none') {
                submitData.is_active = true;
                submitData.inactive_until = null;
            } else if (formData.inactive_type === 'temporary') {
                submitData.is_active = false;
                // Adicionar 30 dias a partir de agora
                const date = new Date();
                date.setDate(date.getDate() + 30);
                submitData.inactive_until = date.toISOString().split('T')[0];
            } else if (formData.inactive_type === 'permanent') {
                submitData.is_active = false;
                submitData.inactive_until = null;
            }

            onSubmit(submitData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="user-form">
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
                    type="password"
                    name="password"
                    placeholder={user ? 'Nova senha (deixe vazio para manter)' : 'Senha'}
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon="🔒"
                    disabled={loading}
                />
            </div>

            <div className="form-row">
                <Input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirmar senha"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation}
                    icon="🔒"
                    disabled={loading}
                />
            </div>

            <div className="form-row">
                <div className="select-wrapper">
                    <label className="select-label">Perfil</label>
                    <select
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                        className={`select-field ${errors.role_id ? 'error' : ''}`}
                        disabled={loading}
                    >
                        <option value="">Selecione um perfil</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    {errors.role_id && (
                        <span className="input-error">{errors.role_id}</span>
                    )}
                </div>
            </div>

            {user && (
                <div className="form-row">
                    <div className="inactive-section">
                        <label className="section-label">Status do Usuário</label>

                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="inactive_type"
                                    value="none"
                                    checked={formData.inactive_type === 'none'}
                                    onChange={handleInactiveTypeChange}
                                    disabled={loading}
                                />
                                <span className="radio-text">
                                    <strong>Ativo</strong>
                                    <small>Usuário pode acessar o sistema normalmente</small>
                                </span>
                            </label>

                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="inactive_type"
                                    value="temporary"
                                    checked={formData.inactive_type === 'temporary'}
                                    onChange={handleInactiveTypeChange}
                                    disabled={loading}
                                />
                                <span className="radio-text">
                                    <strong>Inativo por 30 dias</strong>
                                    <small>Acesso bloqueado temporariamente (férias, afastamento)</small>
                                </span>
                            </label>

                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="inactive_type"
                                    value="permanent"
                                    checked={formData.inactive_type === 'permanent'}
                                    onChange={handleInactiveTypeChange}
                                    disabled={loading}
                                />
                                <span className="radio-text">
                                    <strong>Inativo permanente</strong>
                                    <small>Acesso bloqueado até reativação manual</small>
                                </span>
                            </label>
                        </div>

                        {formData.inactive_type !== 'none' && (
                            <div className="inactive-warning">
                                ⚠️ Este usuário não conseguirá fazer login enquanto estiver inativo
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                    {user ? 'Atualizar' : 'Criar'}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;
