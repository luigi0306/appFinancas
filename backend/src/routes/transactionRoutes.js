const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');
const authMiddleware = require('../middlewares/auth');

// A partir desta linha, todas as rotas abaixo EXIGIRÃO o token
router.use(authMiddleware);

router.post('/', TransactionController.store);
router.get('/', TransactionController.index);
router.delete('/:id_transaction', TransactionController.delete);
router.get('/balance', TransactionController.getBalance);
router.get('/report/categories', TransactionController.getCategoryReport);

module.exports = router;