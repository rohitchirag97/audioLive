const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiftSchema = new Schema({
    giftName: String,
    giftPrice: Number,
    giftDescription: String,
    giftImage: String,
    giftAnimation: String,
    giftType: String,
});

module.exports = mongoose.model('Gift', GiftSchema);
