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
    typeOf: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer'],
        required: [true, 'type of transaction required'],
    },
    amount: {
        type: Number,
        min: [0, 'Transaction amount must not be negative'],
        default: 0,
    },
    submitted: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

module.exports = mongoose.model('Transaction', TransactionSchema);