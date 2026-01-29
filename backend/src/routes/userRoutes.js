const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');

// Rota de Cadastro (Cria o usuário)
router.post('/register', UserController.store); 

// Rota de Login (Autentica o usuário)
router.post('/login', UserController.login);

// Rota de Perfil Protegida (Exige Token)
// O usuário não precisa passar ID na URL, o Token já diz quem ele é
router.get('/profile', authMiddleware, UserController.getProfile);

module.exports = router;