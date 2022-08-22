//Mongoose User Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
    phoneModel: String,
    phoneBrand: String,
    phoneOs: String,
    phoneOsVersion: String,
    phoneScreenSize: String,
    macAddress: String,
    isBanned: {
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
    userList: [
        { 
            userId: { 
                type: Schema.Types.ObjectId, 
                ref: 'User'
            }
        }
    ]
});

module.exports = mongoose.model('Device', DeviceSchema);
