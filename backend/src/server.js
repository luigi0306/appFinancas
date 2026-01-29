require('dotenv').config(); 
const express = require('express');
const db = require('./config/database');
const seedDatabase = require('./database/seeders'); // Importe o seeder
const cors = require('cors');

require('./models/associations'); 

//declarando rotas
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());
app.use(cors());

//usando rotas --> ja falando a pasta base para as requisicoes
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);


// Sincronizar o Banco de Dados
db.sync({})
  .then(async () => {
    console.log('📂 Tabelas sincronizadas');

    // Roda a semente logo após o sync
    await seedDatabase();
    console.log('🚀 Servidor pronto!');
  })
  .catch(err => console.log('Erro: ' + err));

const PORT = 3000;
// Adicionamos o '0.0.0.0' para ele aceitar conexões de qualquer IP da sua rede local
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT} e acessível pela rede local`);
});