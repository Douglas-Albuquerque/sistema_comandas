import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button/Button';
import './MesasPage.css';

const MesasPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="mesas-page-temp">
      <div className="mesas-temp-container">
        <div className="mesas-temp-header">
          <h1>🍽️ Tela de Mesas</h1>
          <p>Em desenvolvimento...</p>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span className="avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="user-details">
            <h2>{user?.name}</h2>
            <p className="user-username">@{user?.username}</p>
            <p className="user-role">{user?.role?.name}</p>
          </div>
        </div>

        <div className="mesas-temp-actions">
          <Button 
            variant="danger" 
            fullWidth 
            onClick={handleLogout}
          >
            🚪 Sair do Sistema
          </Button>
        </div>

        <div className="mesas-temp-info">
          <h3>Informações do Usuário Logado:</h3>
          <div className="info-card">
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Nome:</strong> {user?.name}</p>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Perfil:</strong> {user?.role?.name}</p>
            <p><strong>Slug:</strong> {user?.role?.slug}</p>
            <p><strong>Permissões:</strong></p>
            <ul>
              {user?.role?.permissions?.map((perm, index) => (
                <li key={index}>✓ {perm}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesasPage;
