import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <button className="navbar-menu-btn" onClick={onMenuClick}>
                ☰
            </button>

            <div className="navbar-title">
                {/* <h1>Sistema de Comandas</h1> */}
            </div>

            <div className="navbar-actions">
                <div className="navbar-user">
                    <span className="navbar-username">{user?.name}</span>
                    <div className="navbar-avatar">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                        ) : (
                            <span>{user?.name?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                </div>

                <button className="navbar-logout" onClick={handleLogout} title="Sair">
                    🚪
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
