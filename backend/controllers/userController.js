const User = require('../models/User');

// Create a new user
exports.createUser = async (req,res) => {
    try {
        const { name,email } = req.body;
        const user = await User.create({ name, email });
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).json({ message: "User creation failed", error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req,res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "Users fetched successfully", users });
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch users", error: error.message});
    }
}