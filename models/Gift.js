
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiftSchema = new Schema({
    giftName: String,
    giftPrice: Number,
    giftEvent: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    giftImage: String,
    giftAnimation: String,
    giftType: String,
});

module.exports = mongoose.model('Gift', GiftSchema);
