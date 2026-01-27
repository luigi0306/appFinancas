const Transaction = require('../models/transaction');
const { Op } = require('sequelize');

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
    },

    async getBalance(req, res) {
        try {
            const { id_user } = req.params;
            const { startDate, endDate } = req.query; // Datas vêm pela Query String

            // Criamos um objeto de filtro básico
            let whereCondition = { id_user };

            // Se o usuário enviou as datas, adicionamos o filtro de período
            if (startDate && endDate) {
                whereCondition.date = {
                    [Op.between]: [startDate, endDate] // SQL: WHERE date BETWEEN '...' AND '...'
                };
            }

            // 1. Busca as transações no banco
            const transactions = await Transaction.findAll({ where: whereCondition });

            // 2. Se o array estiver vazio, podemos avisar que não há dados ou retornar saldo zero
            // Aqui, optei por retornar saldo zero, que é o padrão de apps financeiros
            if (transactions.length === 0) {
                return res.status(200).json({
                    id_user,
                    message: "Nenhuma transação encontrada para este usuário."
                });
            }

            // 3. Executa o cálculo (Reduce)
            const balance = transactions.reduce((acc, item) => {
                const value = parseFloat(item.value);

                if (item.type_transaction === 'Receita') {
                    acc.income += value;
                } else {
                    acc.outcome += value;
                }

                acc.total = acc.income - acc.outcome;
                return acc;
            }, { income: 0, outcome: 0, total: 0 });

            // 4. Retorna o resultado formatado
            return res.status(200).json({
                user: id_user,
                startDate: startDate,
                endDate: endDate,
                income: balance.income.toFixed(2),
                outcome: balance.outcome.toFixed(2),
                total: balance.total.toFixed(2)
            });

        } catch (error) {
            // O catch deve envolver todo o processo
            console.error(error);
            return res.status(500).json({ error: "Erro ao filtrar saldo." });
        }
    },

    async getCategoryReport(req, res) {
        try {
            const { id_user } = req.params;
            const { startDate, endDate, category, type_transaction } = req.query;

            // Criamos um objeto de filtro básico
            let whereCondition = { id_user };

            // Se o usuário enviou as datas, adicionamos o filtro de período
            if (startDate && endDate) {
                whereCondition.date = {
                    [Op.between]: [startDate, endDate] // SQL: WHERE date BETWEEN '...' AND '...'
                };
            }

            // Se o usuário enviou o tipo de transação, adicionamos o filtro
            if (type_transaction) {
                whereCondition.type_transaction = type_transaction;
            }

            // Se o usuário enviou a categoria, adicionamos o filtro
            if (category) {
                whereCondition.category = category;
            }

            // 1. Busca as transações no banco
            const transactions = await Transaction.findAll({ where: whereCondition });

            if (transactions.length === 0) {
                return res.status(200).json({
                    id_user,
                    message: "Nenhuma transação encontrada para este usuário."
                });
            }

            const categoryReport = transactions.reduce((acc, item) => {
                const value = parseFloat(item.value);

                if (item.type_transaction === 'Receita') {
                    acc.income += value;
                } else {
                    acc.outcome += value;
                }

                // --- LÓGICA DAS DESCRIÇÕES ---
                // Adicionamos um objeto com os detalhes deste item no nosso array de itens
                acc.items.push({
                    description: item.description,
                    value: value,
                    date: item.date,
                    type: item.type_transaction
                });

                return acc;

            }, { income: 0, outcome: 0, total: 0, type_transaction: type_transaction, category: category, items: [] });

            // Calculamos o total fora do loop para ser mais eficiente
            categoryReport.total = (categoryReport.income - categoryReport.outcome).toFixed(2);

            return res.status(200).json(categoryReport);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao filtrar saldo." });
        }
    }

};