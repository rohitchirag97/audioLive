const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgencySchema = new Schema({
    agencyName: String,
    agencyuid: String,
    agencyowner: {
        uid: String,
    },
    agencyRecruiter: {
        uid: String,
    },
    agencyCreator: {
       uid: String,
    },
});

module.exports = mongoose.model('Agency', AgencySchema);