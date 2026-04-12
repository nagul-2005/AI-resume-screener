import axios from 'axios';

const API = axios.create({
    baseURL: 'https://ai-resume-screener-md8i.onrender.com',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;