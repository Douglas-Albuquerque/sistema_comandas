import Card from '../../../components/common/Card/Card';
import './UserCard.css';

const UserCard = ({ user, onEdit, onDelete }) => {
    const getStatusInfo = () => {
        if (user.is_active) {
            return { text: 'Ativo', class: 'active' };
        }

        if (user.inactive_until) {
            const date = new Date(user.inactive_until);
            const days = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
            return {
                text: `Inativo (${days} dias)`,
                class: 'inactive-temp'
            };
        }

        return { text: 'Inativo', class: 'inactive' };
    };

    const status = getStatusInfo();

    return (
        <Card className="user-card">
            <div className="user-card-header">
                <div className="user-card-avatar">
                    {/* SEMPRE mostrar só a inicial */}
                    <span className="avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="user-card-badges">
                    <div className="user-card-role-badge" data-role={user.role?.slug}>
                        {user.role?.name}
                    </div>
                    <div className={`user-card-status-badge ${status.class}`}>
                        {status.text}
                    </div>
                </div>
            </div>

            <div className="user-card-body">
                <h3 className="user-card-name">{user.name}</h3>
                <p className="user-card-username">@{user.username}</p>
            </div>

            <div className="user-card-actions">
                <button
                    className="user-card-btn btn-edit"
                    onClick={() => onEdit(user)}
                >
                    ✏️ Editar
                </button>
                <button
                    className="user-card-btn btn-delete"
                    onClick={() => onDelete(user)}
                >
                    🗑️ Excluir
                </button>
            </div>
        </Card>
    );
};

export default UserCard;
