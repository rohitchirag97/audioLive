const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceBanSchema = new Schema({
    deviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Device'
    },
    baningReson: String,
    baningDate: String,
    banExpiryDate: String,
    deviceBanProofs: [{
        ProofPath: String,
    }],
    baningUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Deviceban', DeviceBanSchema);