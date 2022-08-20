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
});

module.exports = mongoose.model('Device', DeviceSchema);
