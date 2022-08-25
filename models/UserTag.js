const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTagSchema = new Schema({
    userTag: String,
});

module.exports = mongoose.model('UserTag', UserTagSchema);