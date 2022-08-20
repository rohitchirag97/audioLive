const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomId: String,
    roomName: String,
    roomType: String,
    roomPassword: String,
    RoomCover: String,
    membershipFees: Number,
    roomOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    roomWallpaper: {
        type: Schema.Types.ObjectId,
        ref: 'RoomWallpaper'
    },
    kickList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    roomMembers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    roomAdmins: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
});

module.exports = mongoose.model('Room', RoomSchema);