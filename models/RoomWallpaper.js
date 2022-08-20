const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    Wallpapername: String,
    Wallpaperpath: String,
    Wallpapertype: String,
});

module.exports = mongoose.model('RoomWallpaper', RoomSchema);