import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user, hasPermission } = useAuth();

    const menuItems = [
        {
            title: 'Mesas',
            icon: '🍽️',
            path: '/mesas',
            permission: 'mesas',
        },
        {
            title: 'Usuários',
            icon: '👥',
            path: '/usuarios',
            permission: 'usuarios',
        },
        {
            title: 'Caixa',
            icon: '💰',
            path: '/caixa',
            permission: 'caixa',
        },
        {
            title: 'Relatórios',
            icon: '📊',
            path: '/relatorios',
            permission: 'relatorios',
        },
        {
            title: 'Perfil',
            icon: '⚙️',
            path: '/perfil',
            permission: 'perfil',
        },
        {
            title: 'Customização',
            icon: '🎨',
            path: '/customizacao',
            permission: 'customizacao',
        },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        hasPermission(item.permission)
    );

    const handleLinkClick = () => {
        // Fecha o menu no mobile após clicar
        if (window.innerWidth <= 768) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay para mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-logo">Sistema Comandas</h2>
                    <button className="sidebar-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {filteredMenuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-text">{item.title}</span>
                        </Link>
                    ))}
                </nav>

                {/* <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="sidebar-user-info">
                            <p className="sidebar-user-name">{user?.name}</p>
                            <p className="sidebar-user-role">{user?.role?.name}</p>
                        </div>
                    </div>
                </div> */}
            </aside>
        </>
    );
};

export default Sidebar;
