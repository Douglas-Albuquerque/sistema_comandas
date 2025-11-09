import { useState } from 'react';
import { useProfile } from '../../../hooks/useProfile';
import { useToast } from '../../../hooks/useToast';
import Card from '../../../components/common/Card/Card';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import ConfirmModal from '../../../components/common/ConfirmModal/ConfirmModal';
import ProfileCard from '../components/ProfileCard';
import EditProfileForm from '../components/EditProfileForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import './ProfilePage.css';

const ProfilePage = () => {
    const {
        profile,
        loading,
        updateProfile,
        updatePassword,
        //uploadAvatar,
        //deleteAvatar,
    } = useProfile();
    const { showSuccess, showError } = useToast();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdateProfile = async (data) => {
        setIsSubmitting(true);
        const result = await updateProfile(data);
        setIsSubmitting(false);

        if (result.success) {
            setIsEditModalOpen(false);
            showSuccess('Perfil atualizado com sucesso!');
        } else {
            showError(result.message);
        }
    };

    const handleUpdatePassword = async (data) => {
        setIsSubmitting(true);
        const result = await updatePassword(data);
        setIsSubmitting(false);

        if (result.success) {
            setIsPasswordModalOpen(false);
            showSuccess('Senha alterada com sucesso!');
        } else {
            showError(result.message);
        }
    };

    // const handleAvatarChange = async (file) => {
    //     const result = await uploadAvatar(file);
    //     if (result.success) {
    //         showSuccess('Avatar atualizado com sucesso!');
    //     } else {
    //         showError(result.message);
    //     }
    // };

    // const handleDeleteAvatar = async () => {
    //     const result = await deleteAvatar();
    //     if (result.success) {
    //         showSuccess('Avatar removido com sucesso!');
    //     } else {
    //         showError(result.message);
    //     }
    // };

    if (loading) {
        return (
            <div className="profile-page">
                <Spinner size="large" text="Carregando perfil..." />
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="page-header">
                <h1>⚙️ Configurações</h1>
                <p>Gerencie suas informações pessoais</p>
            </div>

            <div className="profile-layout">
                <div className="profile-main">
                    <ProfileCard
                        profile={profile}
                    //onAvatarChange={handleAvatarChange}
                    //onDeleteAvatar={handleDeleteAvatar}
                    //loading={loading}
                    />
                </div>

                <div className="profile-sidebar">
                    <Card>
                        <h3 className="sidebar-title">⚡ Ações Rápidas</h3>
                        <div className="sidebar-actions">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                ✏️ Editar Informações
                            </Button>
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setIsPasswordModalOpen(true)}
                            >
                                🔒 Alterar Senha
                            </Button>
                        </div>
                    </Card>

                    <Card className="permissions-card">
                        <h3 className="sidebar-title">🔐 Suas Permissões</h3>
                        <div className="permissions-list">
                            {profile?.role?.permissions?.length > 0 ? (
                                profile.role.permissions.map((permission, index) => (
                                    <div key={index} className="permission-item">
                                        <span className="permission-icon">✓</span>
                                        <span className="permission-name">{permission}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-permissions">Nenhuma permissão atribuída</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modal de editar perfil */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Perfil"
                size="medium"
            >
                <EditProfileForm
                    profile={profile}
                    onSubmit={handleUpdateProfile}
                    onCancel={() => setIsEditModalOpen(false)}
                    loading={isSubmitting}
                />
            </Modal>

            {/* Modal de alterar senha */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Alterar Senha"
                size="medium"
            >
                <ChangePasswordForm
                    onSubmit={handleUpdatePassword}
                    onCancel={() => setIsPasswordModalOpen(false)}
                    loading={isSubmitting}
                />
            </Modal>
        </div>
    );
};

export default ProfilePage;
