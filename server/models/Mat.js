const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    installed: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: "#000000",
        required: false
    }
});

module.exports = Mat = mongoose.model('mat', MatSchema);