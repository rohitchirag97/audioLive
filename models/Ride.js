const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RideSchema = new Schema({
    rideName: String,
    rideType: String,
    ridePath: String,
    ridePrice: Number,
});

module.exports = mongoose.model('Ride', RideSchema);