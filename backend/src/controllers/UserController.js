const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
    async store(req, res) {
        try {
            const { name, email, password, id_type_acess } = req.body;

            // Engenharia de Segurança: Criptografando a senha
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Salvando no Banco
            const user = await User.create({
                name,
                email,
                passwordHash, // O Sequelize vai transformar em password_hash no banco
                id_type_acess
            });

            return res.status(201).json({
                message: "Usuário criado com sucesso!",
                user: { id: user.id_user, name: user.name, email: user.email }
            });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao criar usuário. Verifique se o e-mail já existe." });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ error: "Usuário não encontrado." });
            }

            const passwordMatch = await bcrypt.compare(password, user.passwordHash);

            if (!passwordMatch) {
                return res.status(401).json({ error: "Senha incorreta." });
            }

            return res.json({
                message: "Login realizado com sucesso!",
                user: { id: user.id_user, name: user.name, email: user.email }
            });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao realizar login." });
        }
    }

};