const User = require('../models/user');
const LibraryAcess = require('../models/library_acess');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

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
                passwordHash,
                id_type_acess
            });

            return res.status(201).json({
                message: "Usuário criado com sucesso!",
                user: { id: user.id_user, name: user.name, email: user.email }
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: "Erro ao criar usuário. Verifique se o e-mail já existe." });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log("Tentativa de login para:", email);
            console.log("Senha digitada:", password);
            
            // Busca o usuário pelo e-mail
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ error: "E-mail ou senha inválidos." });
            }

            // Compara a senha digitada com o Hash do banco
            const passwordMatch = await bcrypt.compare(password, user.passwordHash);

            if (!passwordMatch) {
                return res.status(401).json({ error: "E-mail ou senha inválidos." });
            }

            // --- GERAÇÃO DO JWT ---
            // Guardamos o ID e o e-mail dentro do Token
            const token = jwt.sign(
                { id: user.id_user, email: user.email },
                SECRET_KEY,
                { expiresIn: '1d' } // Expira em 24 horas
            );

            return res.json({
                message: "Login realizado com sucesso!",
                user: {
                    id: user.id_user,
                    name: user.name
                },
                token: token // O APIDog vai receber essa chave aqui
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno ao realizar login." });
        }
    },

    async getProfile(req, res) {
        try {
            const id_user = req.userId;

            // O findByPk busca pela Chave Primária, é o SELECT mais rápido que existe
            const user = await User.findByPk(id_user, {
                include: { 
                    model: LibraryAcess, // Nome do modelo do seu Tipo de Acesso
                    attributes: ['type_acess'] // Pegamos apenas o nome do cargo/acesso
                },
                attributes: ['id_user', 'name', 'email'] // Evitamos trazer o Hash da senha
            });

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno ao buscar perfil." });
        }
    }
};