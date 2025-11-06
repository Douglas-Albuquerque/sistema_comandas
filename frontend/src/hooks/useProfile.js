import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Buscar perfil
    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/profile');
            setProfile(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao buscar perfil');
        } finally {
            setLoading(false);
        }
    };

    // Atualizar perfil
    const updateProfile = async (data) => {
        try {
            const response = await api.put('/profile', data);
            setProfile(response.data.user);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Erro ao atualizar perfil',
            };
        }
    };

    // Alterar senha
    const updatePassword = async (data) => {
        try {
            await api.put('/profile/password', data);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Erro ao alterar senha',
            };
        }
    };

    // Upload avatar
    // const uploadAvatar = async (file) => {
    //     try {
    //         const formData = new FormData();
    //         formData.append('avatar', file);

    //         const response = await api.post('/profile/avatar', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });

    //         setProfile({ ...profile, avatar: response.data.avatar });
    //         return { success: true, avatar: response.data.avatar };
    //     } catch (err) {
    //         return {
    //             success: false,
    //             message: err.response?.data?.message || 'Erro ao fazer upload do avatar',
    //         };
    //     }
    // };

    // Deletar avatar
    // const deleteAvatar = async () => {
    //     try {
    //         await api.delete('/profile/avatar');
    //         setProfile({ ...profile, avatar: null });
    //         return { success: true };
    //     } catch (err) {
    //         return {
    //             success: false,
    //             message: err.response?.data?.message || 'Erro ao remover avatar',
    //         };
    //     }
    // };

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        updatePassword,
        //uploadAvatar,
        //deleteAvatar,
    };
};
