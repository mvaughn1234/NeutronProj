const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LenSchema = new Schema({
    eIn: {
        type: Number,
        required: true
    },
    eOut: {
        type: Array,
        required: true
    },
    bins: {
        type: Array,
        required: true
    }
});

const LenSetSchema = new Schema({
    len: {
        type: Number,
        required: true,
    },
    lenSet: [LenSchema]
});

module.exports = LenSet = mongoose.model('lenSet', LenSetSchema);