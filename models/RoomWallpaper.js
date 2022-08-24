const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomWallpaperSchema = new Schema({
    Wallpapername: String,
    Wallpaperpath: String,
    wallpaperPrice: Number,
    Wallpapertype: String,
});

module.exports = mongoose.model('RoomWallpaper', RoomWallpaperSchema);