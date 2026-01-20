const library_acess = require('../models/library_acess');

const seedDatabase = async () => {
  try {
    // bulkCreate insere vários registros de uma vez
    // ignoreDuplicates: true evita erro se você rodar o script duas vezes
    await library_acess.bulkCreate([
      { id_type_acess: 1, type_acess: 'Admin' },
      { id_type_acess: 2, type_acess: 'Desenvolvedor' },
      { id_type_acess: 3, type_acess: 'Comum' }
    ], { ignoreDuplicates: true });

    console.log('🌱 Biblioteca de acessos semeada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao semear banco de dados:', error);
  }
};

module.exports = seedDatabase;