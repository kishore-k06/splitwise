const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const { name,members } = req.body;
        const group = await Group.create({ name,members });
        res.status(201).json({ message: "Group created successfully", group });
    } catch (error) {
        res.status(400).json({ message: "Group creation failed", error: error.message });
    }
}

// Get all groups
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('members', 'name email');
        res.status(200).json({ message: "Groups fetched successfully", groups });
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch groups", error: error.message });
    }
}

// Balance Calculation
exports.getGroupBalance = async (req, res) => {
    try {
        const groupId = req.params.id;
        const expenses = await Expense.find({ group: groupId });

        const balanceSheet = {}; // Like C++ map<string, double>

        // Loop through each expense to calculate balances
        for(const expense of expenses) {
            const totalAmount = expense.amount;
            const paidBy = expense.paidBy.toString(); // Convert ObjectId to string
            const splitBetween = expense.splitBetween.map(id => id.toString()); // Array of ObjectId strings

            const share = totalAmount / splitBetween.length;

            // Credit the person who paid
            if(!balanceSheet[paidBy]) {
                balanceSheet[paidBy] = 0;
                balanceSheet[paidBy] += totalAmount;
            }

            // Debit the people who split the expense
            for(const userId of splitBetween) {
                if(!balanceSheet[userId]) {
                    balanceSheet[userId] = 0;
                }
                balanceSheet[userId] -= share;
            }
        }

        // Now balanceSheet contains the net balance for each user = { userId1: +800, userId2: -200, ... }

        // Populate usernames from userIds
        const userIds = Object.keys(balanceSheet); // Extracts all user IDs from the balanceSheet as Strings
        const users = await User.find({ _id: { $in: userIds } }); // Fetches User documents from userSchema for those IDs
        const result = users.map(user => ({
            user: {
                id: user._id,
                name: user.name,
            },
            balance: Math.round(balanceSheet[user._id.toString()] * 100) / 100 // Round to 2 decimal places
        }));
        res.status(200).json({ message: "Group balance calculated successfully", balance: result });
    } catch (error) {
        res.status(400).json({ message: "Failed to calculate group balance", error: error.message });
    }
}