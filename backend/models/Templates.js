const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    _id: Number,
    templateImage: String,
    type: String
});

module.exports = mongoose.model('Template', templateSchema);