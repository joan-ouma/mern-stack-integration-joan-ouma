import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getCurrentUser: () => api.get('/auth/me')
};

export const postsAPI = {
    getAllPosts: (params) => api.get('/posts', { params }),
    getPost: (id) => api.get(`/posts/${id}`),
    createPost: (formData) => api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updatePost: (id, formData) => api.put(`/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deletePost: (id) => api.delete(`/posts/${id}`),
    addComment: (postId, content) => api.post(`/posts/${postId}/comments`, { content })
};

export const categoriesAPI = {
    getAllCategories: () => api.get('/categories'),
    createCategory: (categoryData) => api.post('/categories', categoryData)
};

export default api;