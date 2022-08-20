const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VerificationTypeSchema = new Schema({
    verificationType: String,
    VerificattionDescription: String,
});

module.exports = mongoose.model('VerificationType', VerificationTypeSchema);