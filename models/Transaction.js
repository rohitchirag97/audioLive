const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    coinsAmount: Number,
    TransactionDateTine: String,
    transactionUser: { uid: String },
    transactionType: String,
});

module.exports = mongoose.model('Transaction', TransactionSchema);