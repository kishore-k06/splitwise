const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const expenseSchema = mongoose.Schema({
    group: { type:mongoose.Schema.Types.ObjectId, ref:'Group', required: true },
    description: { type:String },
    amount: { type:Number, required: true },
    paidBy: { type:mongoose.Schema.Types.ObjectId, ref:'User', required: true },
    splitBetween: [{ type:mongoose.Schema.Types.ObjectId, ref:'User', required: true }],
}, {timestamps: true});

module.exports = mongoose.model('Expense', expenseSchema);