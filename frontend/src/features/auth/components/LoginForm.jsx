import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações básicas
    if (!username || !password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      navigate('/mesas');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <h1>Sistema de Comandas</h1>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <Input
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon="👤"
          disabled={loading}
        />

        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon="🔒"
          disabled={loading}
        />

        {error && (
          <div className="login-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
        >
          Entrar
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
