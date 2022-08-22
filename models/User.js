//Mongoose User Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    uid: String,   
    username: String,
    email: String,
    mobile: String,
    password: String,
    profilePic: String,
    frameId: {
        type: Schema.Types.ObjectId,
        ref: 'Frame'
    },
    rideId: {
        type: Schema.Types.ObjectId,
        ref: 'Ride'
    },
    bubbleId: {
        type: Schema.Types.ObjectId,
        ref: 'Bubble'
    },
    hasSpecialUid: {
        type: Boolean,
        default: false
    },
    specialUid: String, 
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedType: {
        type: Schema.Types.ObjectId,
        ref: 'VerifiedType'
    },
    hasOfficialAccess: {
        type: Boolean,
        default: false
    },
    usersentCharishma: {
        type: Number,
        default: 0
    },
    userReceivedCharishma: {
        type: Number,
        default: 0
    },
    userTags: [{
        type: Schema.Types.ObjectId,
        ref: 'UserTag'
    }],
    walletCoins: {
        type: Number,
        default: 0
    },
    isCoinSeller: {
        type: Boolean,
        default: false
    },
    SellerCoins: {
        type: Number,
        default: 0
    },
    coinsellerTransactions: [{  
        soldto: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        soldtouid: String,
        quantity: Number,
        soldDateTime: String,
    }],
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    isRecruiter: {
        type: Boolean,
        default: false
    },
    recruitedAgencies: [{
        agencyId: {
            type: Schema.Types.ObjectId,
            ref: 'Agency'
        },
    }],
    nobleId: {
        type: Schema.Types.ObjectId,
        ref: 'Noble'
    },
    agencyId: {
        type: Schema.Types.ObjectId,
        ref: 'Agency'
    },
    FamilyId: {
        type: Schema.Types.ObjectId,
        ref: 'Family'
    },
    userMedals: [{
        type: Schema.Types.ObjectId,
        ref: 'UserMedal'
    }],
    blockList: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    receivedGifts: [{
        giftId: {
            type: Schema.Types.ObjectId,
            ref: 'Gift'
        },
        quantity: {
            type: Number,
            default: 1  
        },
    }],
    isbanned: {
        type: Boolean,
        default: false
    },
    banReason: String,
    banDate: String,
    banExpiryDate: String,
    banningUnbanAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userTransactions: [{   
        coinsamount: Number,
        transactionDateTime: String,
        TransactinId: String,
    }],
    userNotifications: [{
        notificationType: String,
        coinSellerId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        agencyId: {
            type: Schema.Types.ObjectId,
            ref: 'Agency'
        },
        agencyUid: String,   
        message: String,
        coinSellerUid: String,
        CoinsPurchased: Number,
        notificationDateTime: String,
    }],
    created_at: {
        type: String
    },
    deviceList: [{
        deviceId:{
        type: Schema.Types.ObjectId,
        ref: 'Device'
        }
    }],
});

module.exports = mongoose.model('User', UserSchema);