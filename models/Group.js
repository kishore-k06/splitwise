const mongoose = require('mongoose');

// This file defines the Group model for the Splitwise application.

const groupSchema = mongoose.Schema({
    name: { type: String, required: true},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
},{timestamps: true});

module.exports = mongoose.model('Group',groupSchema);