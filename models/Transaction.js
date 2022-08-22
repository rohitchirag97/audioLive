const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    coinsAmount: Number,
    TransactionDateTine: String,
    sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Transaction', TransactionSchema);