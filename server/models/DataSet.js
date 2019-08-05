const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSetSchema = new Schema({
    eIn: {
        type: Number,
        required: true
    },
    len: {
        type: Number,
        required: true
    },
    eOut: {
        type: Array,
        required: true
    }
});

module.exports = DataSet = mongoose.model('dataSet', DataSetSchema);