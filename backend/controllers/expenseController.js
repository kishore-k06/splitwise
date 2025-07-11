const Expense = require('../models/Expense');
const Group = require('../models/Group');

// Create a new expense
exports.addExpense = async (req, res) => {
    try {
        const userId = req.user.userId; // userId is set by authMiddleware; 
        const { groupId, description, amount, paidBy, splitBetween } = req.body;
        const groupData = await Group.findById(groupId);
        if (!groupData || !groupData.members.map(id => id.toString()).includes(userId)) {
            return res.status(403).json({ message: "Access denied. You are not a member of this group." });
        }
        const expense = await Expense.create({ group: groupId, description, amount, paidBy, splitBetween }); 
        res.status(201).json({ message: "Expense created successfully", expense });
    } catch (error) {
        res.status(400).json({ message:"Expense creation failed", error: error.message });
    }
}

// Get all expenses for a group
exports.getGroupExpenses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { groupId } = req.params;
        const groupData = await Group.findById(groupId);
        if (!groupData || !groupData.members.map(id => id.toString()).includes(userId)) {
            return res.status(403).json({ message: "Access denied. You are not a member of this group." });
        }

        const expenses = await Expense.find({ group: groupId })
            .populate('paidBy', 'name email')
            .populate('splitBetween', 'name email');
        res.status(200).json({ message: "Expenses fetched successfully", expenses });   
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch expenses", error: error.message });
    }
}

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { expenseId } = req.params;

        const expense = await Expense.findById(expenseId);
        if(!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const group = await Group.findById(expense.group);
        if(!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isMember = group.members.map(id => id.toString()).includes(userId);
        if(!isMember) {
            return res.status(403).json({ message: "Access denied. You are not a member of this group." });
        }

        await Expense.findByIdAndDelete(expenseId);
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete expense", error: error.message });
    }
};