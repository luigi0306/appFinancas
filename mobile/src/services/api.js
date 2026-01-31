import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.0.104:3000', // Sem espaços antes ou depois
    timeout: 10000
});

export default api;