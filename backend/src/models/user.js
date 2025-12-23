const { DataTypes } = require('sequelize');
const db = require('../config/database'); // Sua conexão configurada anteriormente

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  underscored: true // Isso transforma password_hash em password_hash no MySQL automaticamente
});
