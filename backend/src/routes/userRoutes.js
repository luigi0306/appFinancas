const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Rota de Cadastro (Cria o usuário)
router.post('/register', UserController.store); 

// Rota de Login (Autentica o usuário)
router.post('/login', UserController.login);

module.exports = router;