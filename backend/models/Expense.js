const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    group: { type:mongoose.Schema.Types.ObjectId, ref:'Group', required: true },
    description: { type:String },
    amount: { type:Number, required: true },
    paidBy: { type:mongoose.Schema.Types.ObjectId, ref:'User', required: true },
    splitBetween: [{ type:mongoose.Schema.Types.ObjectId, ref:'User', required: true }],
}, {timestamps: true});

module.exports = mongoose.model('Expense', expenseSchema);