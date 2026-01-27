const User = require('./user');
const Transaction = require('./transaction');
const Library_acess = require('./library_acess');

// Relacionamentos: Tipo de Acesso <-> Usuários
Library_acess.hasMany(User, { foreignKey: 'id_type_acess' });
User.belongsTo(Library_acess, { foreignKey: 'id_type_acess' });

// Relacionamentos: Usuário <-> Transações
User.hasMany(Transaction, { foreignKey: 'id_user' });
Transaction.belongsTo(User, { foreignKey: 'id_user' });

// Exportamos os modelos já relacionados (opcional, mas boa prática)
module.exports = { User, Transaction, Library_acess };