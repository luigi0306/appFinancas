const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Library_acesses = db.define('Library_acesses', {
  id_type_acess: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type_acess: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true, // Garante que não existam dois "admin"
  }
}, {
  underscored: true,
});

module.exports = Library_acesses;