const express = require('express');
const router = express.Router();
const { addExpense, getAllExpenses } = require('../controllers/expenseController');

router.post('/add', addExpense); // Route to add a new expense
router.get('/:groupId', getAllExpenses); // Route to get all expenses for a specific group

module.exports = router;