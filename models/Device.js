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
    deviceBan: {
        isBanned: {
            type: Boolean,
            default: false
        },
        banReason: String,
        banDate: String,
        banExpiryDate: String,
        banningAdmin: {
            uid: String,
        }
    },
    userList: [
        { 
            uid: String,
        }
    ]
});

module.exports = mongoose.model('Device', DeviceSchema);
