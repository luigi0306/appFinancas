import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.1.3:3000', // Sem espaços antes ou depois
    timeout: 10000
});

export default api;