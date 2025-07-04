const Expense = require('../models/Expense');
const Group = require('../models/Group');

// Create a new expense
exports.addExpense = async (req, res) => {
    try {
        const userId = req.user.userId; // userId is set by authMiddleware; 
        const { group, description, amount, paidBy, splitBetween } = req.body;
        const groupData = await Group.findById(group);
        if (!groupData || !groupData.members.map(id => id.toString()).includes(userId)) {
            return res.status(403).json({ message: "Access denied. You are not a member of this group." });
        }
        const expense = await Expense.create({ group, description, amount, paidBy: userId, splitBetween }); 
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