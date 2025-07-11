const express = require('express');
const router = express.Router();
const { addExpense, deleteExpense, getGroupExpenses } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, addExpense); // Route to add a new expense
router.get('/:groupId', authMiddleware, getGroupExpenses); // Route to get all expenses for a specific group
router.delete('/:expenseId', authMiddleware, deleteExpense); // Route to delete an expense by ID

module.exports = router;