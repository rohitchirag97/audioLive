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
        uid: String,
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
    nobleId: {
        type: Schema.Types.ObjectId,
        ref: 'Noble'
    },
    agencyId: {
        type: Schema.Types.ObjectId,
        ref: 'Agency'
    },
    agencyRole: String,
    FamilyId: {
        type: Schema.Types.ObjectId,
        ref: 'Family'
    },
    FamilyRole: String, 
    userMedals: [{
        type: Schema.Types.ObjectId,
        ref: 'UserMedal'
    }],
    blockList: [{
        uid: String,
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
    BannedUser: {
        isbanned: {
            type: Boolean,
            default: false
        },
        banReason: String,
        banDateTime: String,
        banExpiryDate: String,
        banninguser: {
            uid: String,
        },
    },
    isbanned: {
        type: Boolean,
        default: false
    },
    userNotifications: [{
        notificationType: String,
        coinSellerId: {
            uid: String,
        },
        agencyId: {
            agencyUid: String,
        },
        agencyUid: String,   
        message: String,
        coinSellerUid: String,
        CoinsPurchased: Number,
        notificationDateTime: String,
    }],
    createdAt: {
        type: String
    },
    deviceList: [{
        deviceId:{
        type: Schema.Types.ObjectId,
        ref: 'Device'
        }
    }],
    agencyUnderOfficialifOfficial:[
        {
            agencyId: {
                type: Schema.Types.ObjectId,
                ref: 'Agency'
            },
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);