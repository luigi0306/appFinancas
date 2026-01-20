const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./user'); // Importamos o User para criar a relação

const Transactions = db.define('Transactions', {
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
});

module.exports = Transactions;