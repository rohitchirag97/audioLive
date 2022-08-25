const mongoos = require('mongoose');
const Schema = mongoos.Schema;

const CoinsSellerTransactionSchema = new Schema({
    selleruid: String,
    uid: String,
    amount: Number,
    dateTime: String
});

module.exports = mongoos.model('CoinsSellerTransaction', CoinsSellerTransactionSchema);