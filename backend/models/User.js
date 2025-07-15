const mongoose = require('mongoose');

// This file defines the User model for the Splitwise application.

const userSchema = new mongoose.Schema({
    name: { type:String, required: true },
    email: { type:String, required:true, unique: true },
    password: { type:String, required:true, validator: function(v) {
        return  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(v);
    },
    message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.' },
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);