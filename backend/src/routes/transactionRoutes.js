const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

router.post('/', TransactionController.store);
router.get('/:id_user', TransactionController.index);
router.delete('/:id_transaction', TransactionController.delete);
router.get('/balance/:id_user', TransactionController.getBalance);
router.get('/report/categories/:id_user', TransactionController.getCategoryReport);

module.exports = router;