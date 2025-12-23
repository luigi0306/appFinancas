const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./user'); // Importamos o User para criar a relação

const Transaction = db.define('Transaction', {
  id_transaction: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type_transaction: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Receita', 'Despesa']] // Validação para garantir os tipos corretos
    }
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01 // Garante que não existem transações de valor zero
    }
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY, // Guarda apenas a data (AAAA-MM-DD), sem a hora
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  underscored: true,
  tableName: 'transactions'
});

// --- ASSOCIAÇÃO (A Chave Estrangeira do diagrama) ---
// Um Usuário tem muitas Transações
User.hasMany(Transaction, { foreignKey: 'id_user' });
// Uma Transação pertence a um Usuário
Transaction.belongsTo(User, { foreignKey: 'id_user' });

module.exports = Transaction;