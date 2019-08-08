const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BinSchema = new Schema({
    bin: Number,
    value: Number
});

const LenSchema = new Schema({
    eIn: {
        type: Number,
        required: true
    },
    eOut: [BinSchema]
});

const LenSetSchema = new Schema({
    len: {
        type: Number,
        required: true,
    },
    lenSet: [LenSchema]
});

module.exports = LenSet = mongoose.model('lenSet', LenSetSchema);