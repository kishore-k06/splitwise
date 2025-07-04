const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
exports.registerUser = async (req, res) => { 
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne( { email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

// Login as an existing user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Checks if user has registered
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { 
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ 
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};