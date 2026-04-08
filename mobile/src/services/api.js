import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.0.121:3000', // Substitua pelo IP da sua máquina na rede local
    timeout: 10000
});

export default api;