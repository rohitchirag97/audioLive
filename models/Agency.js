const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgencySchema = new Schema({
    agencyName: String,
    agencyuid: String,
    
    agencyMembers: [{
        agencyMemberId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
        }
    }],
    agencyowner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    agencyRecruiter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    agencyCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Agency', AgencySchema);