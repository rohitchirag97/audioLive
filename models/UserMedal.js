const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserMedalSchema = new Schema({
    userMedalName: String,
    MedalImagepath: String,
});

module.exports = mongoose.model('UserMedal', UserMedalSchema);