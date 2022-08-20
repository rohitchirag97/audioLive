const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BubbleSchema = new Schema({
    bubbleName: String,
    bubblePath: String,
    bubbleType: String,
    bubblePrice: Number
});

module.exports = mongoose.model('Bubble', BubbleSchema);
