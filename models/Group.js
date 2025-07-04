const mongoose = require('mongoose');
const { create } = require('./User');

// This file defines the Group model for the Splitwise application.

const groupSchema = mongoose.Schema({
    name: { type: String, required: true},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
},{timestamps: true});

module.exports = mongoose.model('Group', groupSchema);