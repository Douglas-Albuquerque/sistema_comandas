import { useState } from 'react';
import { useUsers } from '../../../hooks/useUsers';
import Modal from '../../../components/common/Modal/Modal';
import ConfirmModal from '../../../components/common/ConfirmModal/ConfirmModal';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';
import './UsersPage.css';

const UsersPage = () => {
    const { users, roles, loading, createUser, updateUser, deleteUser } = useUsers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filter, setFilter] = useState('all');

    const handleOpenCreateModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);

        let result;
        if (selectedUser) {
            result = await updateUser(selectedUser.id, formData);
        } else {
            result = await createUser(formData);
        }

        setIsSubmitting(false);

        if (result.success) {
            handleCloseModal();
        } else {
            alert(result.message);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            const result = await deleteUser(userToDelete.id);
            if (!result.success) {
                alert(result.message);
            }
        }
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true;
        return user.role?.slug === filter;
    });

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1>👥 Usuários</h1>
                    <p>Gerencie os usuários do sistema</p>
                </div>
                <Button variant="primary" onClick={handleOpenCreateModal}>
                    ➕ Novo Usuário
                </Button>
            </div>

            <div className="users-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todos ({users.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'admin' ? 'active' : ''}`}
                    onClick={() => setFilter('admin')}
                >
                    Admin ({users.filter(u => u.role?.slug === 'admin').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'caixa' ? 'active' : ''}`}
                    onClick={() => setFilter('caixa')}
                >
                    Caixa ({users.filter(u => u.role?.slug === 'caixa').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'garcom' ? 'active' : ''}`}
                    onClick={() => setFilter('garcom')}
                >
                    Garçom ({users.filter(u => u.role?.slug === 'garcom').length})
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <Spinner size="large" text="Carregando usuários..." />
                </div>
            ) : (
                <div className="users-grid">
                    {filteredUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {filteredUsers.length === 0 && !loading && (
                <div className="empty-state">
                    <p>Nenhum usuário encontrado</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
                size="medium"
            >
                <UserForm
                    user={selectedUser}
                    roles={roles}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                    loading={isSubmitting}
                />
            </Modal>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Excluir Usuário"
                message={`Tem certeza que deseja excluir o usuário "${userToDelete?.name}"?`}
                confirmText="Sim, excluir"
                cancelText="Cancelar"
                danger={true}
            />
        </div>
    );
};

export default UsersPage;
