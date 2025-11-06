import { useState } from 'react';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import './ProfileCard.css';

const ProfileCard = ({ profile, onAvatarChange, onDeleteAvatar, loading }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            await onAvatarChange(file);
            setUploading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        const confirmed = window.confirm('Tem certeza que deseja remover seu avatar?');
        if (confirmed) {
            await onDeleteAvatar();
        }
    };

    return (
        <Card className="profile-card">
            <div className="profile-card-header">
                <h2>👤 Meu Perfil</h2>
            </div>

            {/* <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar-large">
                        {profile?.avatar ? (
                            <img src={profile.avatar} alt={profile.name} />
                        ) : (
                            <span className="avatar-placeholder-large">
                                {profile?.name?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {uploading && (
                        <div className="avatar-uploading">
                            <span>Enviando...</span>
                        </div>
                    )}
                </div>

                <div className="profile-avatar-actions">
                    <label className="btn btn-primary btn-upload">
                        {uploading ? 'Enviando...' : '📷 Alterar Foto'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading || loading}
                            style={{ display: 'none' }}
                        />
                    </label>

                    {profile?.avatar && (
                        <Button
                            variant="danger"
                            onClick={handleDeleteAvatar}
                            disabled={uploading || loading}
                        >
                            🗑️ Remover Foto
                        </Button>
                    )}
                </div>
            </div> */}

            <div className="profile-info-section">
                <div className="profile-info-item">
                    <span className="info-label">Nome</span>
                    <span className="info-value">{profile?.name}</span>
                </div>

                <div className="profile-info-item">
                    <span className="info-label">Usuário</span>
                    <span className="info-value">@{profile?.username}</span>
                </div>

                <div className="profile-info-item">
                    <span className="info-label">Perfil</span>
                    <span className="info-value profile-role" data-role={profile?.role?.slug}>
                        {profile?.role?.name}
                    </span>
                </div>

                <div className="profile-info-item">
                    <span className="info-label">Membro desde</span>
                    <span className="info-value">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '-'}
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default ProfileCard;
