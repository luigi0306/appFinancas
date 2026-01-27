require('dotenv').config(); 
const express = require('express');
const db = require('./config/database');
const seedDatabase = require('./database/seeders'); // Importe o seeder

require('./models/associations'); 

//declarando rotas
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());

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
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});