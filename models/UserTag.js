const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTagSchema = new Schema({
    userTag: String,
    userTagDescription: String,
});

module.exports = mongoose.model('UserTag', UserTagSchema);