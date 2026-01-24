const Transaction = require('../models/transaction');

module.exports = {

    async delete(req, res) {
        try {
            const { id_transaction } = req.params;

            // Executa a deleção
            const rowsDeleted = await Transaction.destroy({ where: { id_transaction } });

            // Engenharia Preventiva: Verifica se algo foi realmente deletado
            if (rowsDeleted === 0) {
                return res.status(404).json({ error: "Transação não encontrada." });
            }

            return res.status(200).json({
                message: "Transação deletada com sucesso!"
            });
        } catch (error) {
            return res.status(500).json({ error: "Erro interno ao deletar transação." });
        }
    },

    async index(req, res) {
        try {
            const { id_user } = req.params;

            const transactions = await Transaction.findAll({
                where: { id_user },
                order: [['date', 'DESC']]
            });

            return res.status(201).json({
                message: "Transações listadas com sucesso!",
                transactions: transactions
            });

        } catch (error) {
            return res.status(400).json({ error: "Erro ao listar transações." });
        }
    },

    async store(req, res) {
        try {
            const { type_transaction, value, category, description, date, id_user } = req.body;

            const transaction = await Transaction.create({
                type_transaction,
                value,
                category,
                description,
                date,
                id_user
            });

            return res.status(201).json({
                message: "Transação criada com sucesso!",
                transaction: { id: transaction.id_transaction, type_transaction: transaction.type_transaction, value: transaction.value, category: transaction.category, description: transaction.description, date: transaction.date }
            });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao criar transação. Verifique os dados." });
        }
    }

};