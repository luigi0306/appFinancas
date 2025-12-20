require('dotenv').config(); // Carrega as variáveis do .env
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Define como true se quiser ver os comandos SQL no terminal
    define: {
      timestamps: true, // Cria createdAt e updatedAt automaticamente
      underscored: true // Mantém o padrão snake_case para o banco
    }
  }
);

// Testando a conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o MySQL estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
}

testConnection();

module.exports = sequelize;