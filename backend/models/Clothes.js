const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    clothesImage: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Clothes', clothesSchema);