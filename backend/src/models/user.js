const { DataTypes } = require('sequelize');
const db = require('../config/database'); // Sua conexão configurada anteriormente

const Users = db.define('Users', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
  underscored: true // Isso transforma passwordHash em password_hash no MySQL automaticamente
});

module.exports = Users;