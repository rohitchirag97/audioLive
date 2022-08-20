const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgencySchema = new Schema({
    agencyName: String,
    agencyCode: String,
    agencyAdmins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    agencyMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    agencyowner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Agency', AgencySchema);