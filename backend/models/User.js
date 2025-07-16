const mongoose = require('mongoose');

// This file defines the User model for the Splitwise application.

const userSchema = new mongoose.Schema({
    name: { type:String, required: true },
    email: { type:String, required:true, unique: true },
    password: { type:String, required:true },
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);