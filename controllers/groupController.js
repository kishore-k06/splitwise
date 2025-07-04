const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const userId = req.user.userId; // userId is set by authMiddleware
        const { name,members } = req.body;
        const newGroup = new Group({
            name,
            members: [...members, userId], // Add the creator to the members list
            createdBy: userId
        });
        await newGroup.save();
        res.status(201).json({ message: "Group created successfully", newGroup });
    } catch (error) {
        res.status(400).json({ message: "Group creation failed", error: error.message });
    }
}

// Get all groups
exports.getMyGroups = async (req, res) => {
    try {
        const userId = req.user.userId; 

        const groups = await Group.find({ members: userId }).populate('members', 'name email').populate('createdBy', 'name email');
        res.status(200).json({ message: "Groups fetched successfully", groups });
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch groups", error: error.message });
    }
}

// Balance Calculation
exports.getGroupBalance = async (req, res) => {
    try {
        const groupId = req.params.id;
        // Check if the user is a member of the group
        const group = await Group.findById(groupId);
        console.log("Group members:", group.members.map(id => id.toString()));
        console.log("Requesting user:", req.user.userId);

        if (!group.members.map(id => id.toString()).includes(req.user.userId)) {
            return res.status(403).json({ message: "Access denied to this group" });
        }

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
            }
            balanceSheet[paidBy] += totalAmount;

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

// Get settlement plan who needs to pay whom
exports.getSettlementPlan = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        const group = await Group.findById(groupId);
        if (!group.members.includes(req.user.userId)) {
            return res.status(403).json({ message: "Access denied to this group" });
        }

        const expenses = await Expense.find({ group: groupId });
        const balanceSheet = {};

        for(const expense of expenses) {
            const totalAmount = expense.amount;
            const paidBy = expense.paidBy.toString();
            const splitBetween = expense.splitBetween.map(id => id.toString());

            const share = totalAmount / splitBetween.length;

            if(!balanceSheet[paidBy]) {
                balanceSheet[paidBy] = 0;
            }
            balanceSheet[paidBy] += totalAmount;

            for(const userId of splitBetween) {
                if(!balanceSheet[userId]) {
                    balanceSheet[userId] = 0;
                }
                balanceSheet[userId] -= share;
            }
        }
        // Storing the KVP of balanceSheet in an array
        const balances = Object.entries(balanceSheet).map(([userId, balance]) => ({
            userId,
            balance: Math.round(balance * 100) / 100 // Round to 2 decimal places
        })).filter(entry => entry.balance !== 0);

        // Find users from balanceSheet to get their names
        const users = await User.find({ _id: { $in: balances.map(b => b.userId) } });
        const idToName = {};
        users.forEach(user => {
            idToName[user._id.toString()] = user.name;
        });
        console.log("BalanceSheet:", balanceSheet);
        const settlements = [];

        // Finding debtors and creditors and sorting them
        const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
        const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
        console.log("Debtors:", debtors);
        console.log("Creditors:", creditors);

        // Settle debts between debtors and creditors using two pointers
        let i=0, j=0;
        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];
            
            const settledAmount = Math.min(-debtor.balance, creditor.balance);
            settlements.push({
                from: idToName[debtor.userId],
                to: idToName[creditor.userId],
                amount: Math.round(settledAmount * 100) / 100 // Round to 2 decimal places
            });

            debtor.balance += settledAmount;
            creditor.balance -= settledAmount;

            if(Math.abs(debtor.balance) < 0.01) {
                i++;
            }
            if(Math.abs(creditor.balance) < 0.01) {
                j++;
            }
        }
        res.status(200).json({ message: "Settlement plan calculated successfully", settlements });

    } catch (error) {
        res.status(400).json({ message: "Failed to get settlement plan", error: error.message });
    }
}