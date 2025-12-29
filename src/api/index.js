/**
 * Configuration API - Axios instance for backend communication
 */
import axios from 'axios';

// En production utilise VITE_API_URL, sinon localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============== AUTH API ==============

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => {
        const formData = new URLSearchParams();
        formData.append('username', data.email);
        formData.append('password', data.password);
        return api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
    },
    getMe: () => api.get('/auth/me'),
};

// ============== RECIPES API ==============

export const recipesAPI = {
    getAll: (categorie = null, search = null, auteur_id = null, tag = null) => {
        const params = {};
        if (categorie) params.categorie = categorie;
        if (search) params.search = search;
        if (auteur_id) params.auteur_id = auteur_id;
        if (tag) params.tag = tag;
        return api.get('/recipes', { params });
    },
    getById: (id) => api.get(`/recipes/${id}`),
    create: (data) => api.post('/recipes', data),
    update: (id, data) => api.put(`/recipes/${id}`, data),
    delete: (id) => api.delete(`/recipes/${id}`),
};

// ============== FRIGO SEARCH API ==============

export const frigoAPI = {
    search: (ingredients, strictMode = false) => api.post('/search/frigo', {
        ingredients,
        strict_mode: strictMode
    }),
};

// ============== ADMIN API ==============

export const adminAPI = {
    getUsers: () => api.get('/admin/users'),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    toggleAdmin: (id) => api.put(`/admin/users/${id}/toggle-admin`),
    deleteRecipe: (id) => api.delete(`/admin/recipes/${id}`),
};

export default api;

