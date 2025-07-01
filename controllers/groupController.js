const Group = require('../models/Group');

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
exports.getAllGroups = async (req,res) => {
    try {
        const groups = await Group.find().populate('members', 'name email');
        res.status(200).json({ message: "Groups fetched successfully", groups });
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch groups", error: error.message });
    }
}