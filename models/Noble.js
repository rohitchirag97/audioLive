const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NobleSchema = new Schema({
    NobleName: String,
    boblePrice: Number,
    hasNobleSpecialUid: Boolean,
    specialNobleUid: String, 
    NobleImagePath: String,
    hasNobleBadge: Boolean,
    NobleBadgeImagePath: String,
    hasNobleColorName: Boolean,
    hasNobleSeat: Boolean,
    goldbackperDay: Number,
    hasNobleFrame: Boolean,
    NobleFrameId:{
        type: Schema.Types.ObjectId,
        ref: 'Frame'
    },
    hasNobleSpeedUpgrade: Boolean,
    speedupgradeRate: Number, //rate of speed of Upgrade
    hasNobleNameCard: Boolean,
    NobleNameCardImagePath: String,
    hasNobleChatBubbble: Boolean,
    nobleChatBubbleId:{
        type: Schema.Types.ObjectId,
        ref: 'Bubble'
    },
    hasFlyingComments: Boolean,
    hasNobleRide: Boolean,
    nobleRideId:{
        type: Schema.Types.ObjectId,
        ref: 'Ride'
    },
    canSendPicturesInRoom: Boolean,
    hasNoKickOut: Boolean,
});

module.exports = mongoose.model('Noble', NobleSchema);