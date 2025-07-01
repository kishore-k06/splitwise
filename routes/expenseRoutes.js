const express = require('express');
const router = express.Router();
const { addExpense, getGroupExpenses } = require('../controllers/expenseController');

router.post('/add', addExpense); // Route to add a new expense
router.get('/:groupId', getGroupExpenses); // Route to get all expenses for a specific group

module.exports = router;