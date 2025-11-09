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
        if (window.innerWidth <= 768) {
            onClose();
        }
    };

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/mesas" className="sidebar-logo-link" onClick={handleLinkClick}>
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="sidebar-logo"
                        />
                    </Link>
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

            </aside>
        </>
    );
};

export default Sidebar;
