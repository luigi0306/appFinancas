const express = require('express');
const db = require('./config/database');
const user = require('./models/user'); 
const transaction = require('./models/transaction');

// const AccessLevel = require('./models/AccessLevel'); // Se já tiver criado o outro

const app = express();
app.use(express.json());

// Sincronizar o Banco de Dados
// O { alter: true } atualiza a tabela se você adicionar colunas depois
db.sync({ alter: true })
  .then(() => console.log('📂 Tabelas sincronizadas no MySQL'))
  .catch(err => console.log('Erro ao sincronizar tabelas: ' + err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});