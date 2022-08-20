const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserwallpaperSchema = new Schema({
    userid: String,
    wallparid: String,
    expirydate: String,
});

module.exports = mongoose.model('Userwallpaper', UserwallpaperSchema);