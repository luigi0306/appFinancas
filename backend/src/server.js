const express = require('express');
const db = require('./config/database');
const Users = require('./models/user');
const Transactions = require('./models/transaction');
const Library_acesses = require('./models/library_acess');
const seedDatabase = require('./database/seeders'); // Importe o seeder
const UserController = require('./controllers/UserController');
const TransactionController = require('./controllers/TransactionController');

const app = express();
app.use(express.json());


// Rotas
app.post('/users', UserController.store);
app.post('/login', UserController.login);
app.post('/transactions', TransactionController.store);
app.get('/transactions/:id_user', TransactionController.index);
app.delete('/transactions/:id_transaction', TransactionController.delete);
app.get('/transactions/balance/:id_user', TransactionController.getBalance);


// Relacionamentos
Library_acesses.hasMany(Users, { 
  foreignKey: 'id_type_acess',
  constraints: true,
  foreignKeyConstraint: true 
});

// Uma Usuario pertence a um Tipo de Acesso
Users.belongsTo(Library_acesses, { foreignKey: 'id_type_acess' });

// Um Usuário tem muitas Transações
Users.hasMany(Transactions, { 
  foreignKey: 'id_user',
  constraints: true,
  foreignKeyConstraint: true 
});

// Uma Transação pertence a um Usuário
Transactions.belongsTo(Users, { foreignKey: 'id_user' });


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