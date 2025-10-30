import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Buscar usuários
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/users');
            setUsers(response.data.users);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao buscar usuários');
        } finally {
            setLoading(false);
        }
    };

    // Buscar roles
    const fetchRoles = async () => {
        try {
            const response = await api.get('/roles');
            setRoles(response.data.roles);
        } catch (err) {
            console.error('Erro ao buscar roles:', err);
        }
    };

    // Criar usuário
    const createUser = async (userData) => {
        try {
            const response = await api.post('/users', userData);
            setUsers([...users, response.data.user]);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Erro ao criar usuário',
            };
        }
    };

    // Atualizar usuário
    const updateUser = async (id, userData) => {
        try {
            const response = await api.put(`/users/${id}`, userData);
            setUsers(users.map(user => user.id === id ? response.data.user : user));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Erro ao atualizar usuário',
            };
        }
    };

    // Deletar usuário
    const deleteUser = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Erro ao deletar usuário',
            };
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    return {
        users,
        roles,
        loading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
    };
};
