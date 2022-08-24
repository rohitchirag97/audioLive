const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomName: String,
    roomType: String,
    roomPassword: String,
    RoomCover: String,
    membershipFees: Number,
    WallPaper: {
        type: Schema.Types.ObjectId,
        ref: 'RoomWallpaper'
    },
    roomOwner: {
        uid: String,
    },
    roomWallpaper: {
        uid: String,
    },
    kickList: [
        {
            uid: String,
        }
    ],
    roomMembers: [{
        uid:{
            uid: String,
        },
        userRole: String,
    }]
});

module.exports = mongoose.model('Room', RoomSchema);