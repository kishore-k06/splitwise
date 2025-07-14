const express = require('express');
const router = express.Router();
const { addExpense, deleteExpense, getGroupExpenses, addComment } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, addExpense); // Route to add a new expense
router.get('/:groupId', authMiddleware, getGroupExpenses); // Route to get all expenses for a specific group
router.delete('/:expenseId', authMiddleware, deleteExpense); // Route to delete an expense by ID
router.post('/:expenseId/comments', authMiddleware, addComment); // Route to add a comment to an expense

module.exports = router;