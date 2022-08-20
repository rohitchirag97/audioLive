const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FrameSchema = new Schema({
    frameName: String,
    framePath: String,
    frameType: String,
    framePrice: Number
});

module.exports = mongoose.model('Frame', FrameSchema);