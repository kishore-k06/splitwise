const Expense = require('../models/Expense');

// Create a new expense
exports.addExpense = async (req, res) => {
    try {
        const { group, description, amount, paidBy, splitBetween } = req.body;
        const expense = await Expense.create({ group, description, amount, paidBy, splitBetween }); 
        res.status(201).json({ message: "Expense created successfully", expense });
    } catch (error) {
        res.status(400).json({ message:"Expense creation failed", error: error.message });
    }
}

// Get all expenses for a group
exports.getGroupExpenses = async (req, res) => {
    try {
        const { groupId } = req.params;
        const expenses = await Expense.find({ group: groupId })
            .populate('paidBy', 'name email')
            .populate('splitBetween', 'name email');
        res.status(200).json({ message: "Expenses fetched successfully", expenses });   
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch expenses", error: error.message });
    }
}