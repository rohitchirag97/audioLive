const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NobleSchema = new Schema({
    NobleName: String,
    NobleDescription: String,
    boblePrice: Number,
    hasNobleSpecialUid: Boolean, 
    NobleImagePath: String,
    hasNobleBadge: Boolean,
    NobleBadgeImagePath: String,
    hasNobleColorName: Boolean,
    hasNobleSeat: Boolean,
    goldbackperDay: Number,
    hasNobleFrame: Boolean,
    NobleFrameImagePath: String,
    hasNobleSpeedUpgrade: Boolean,
    hasNobleNameCard: Boolean,
    NobleNameCardImagePath: String,
    hasNobleChatBubbble: Boolean,
    NobleChatBubbbleImagePath: String,
    hasFlyingComments: Boolean,
    hasNobleRide: Boolean,
    canSendPicturesInRoom: Boolean,
    hasNoKickOut: Boolean,
});

module.exports = mongoose.model('Noble', NobleSchema);