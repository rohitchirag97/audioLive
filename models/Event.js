const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    eventName: String,
    eventStartDate: String,
    eventEndDate: String,
    eventDescription: String,
    eventPageURL: String,
    eventImage: String,
});

module.exports = mongoose.model('Event', EventSchema);