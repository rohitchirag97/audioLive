const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserBanSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    banReason: String,
    baningDate: String,
    banExpiry: String,
    baningUserId: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('UserBan', UserBanSchema);