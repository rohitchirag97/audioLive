const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
    familyName: String,
    familyCode: String,
    familyAdmins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    familyMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    familyowner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Family', FamilySchema);
