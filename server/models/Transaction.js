const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'user required'],
    },
    recipient: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    recipientEmail: {
        type: String,
    },
    typeOf: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer'],
        required: [true, 'type of transaction required'],
    },
    amount: {
        type: Number,
        min: [0, 'Transaction amount must not be negative'],
        required: [true, 'amount required'],
    },
    submitted: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

module.exports = mongoose.model('Transaction', TransactionSchema);