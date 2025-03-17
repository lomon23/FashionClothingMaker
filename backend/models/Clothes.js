const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
    _id: Number,
    clothesImage: String,
    name: String
});

module.exports = mongoose.model('Clothes', clothesSchema);