const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mat = require('./Mat');
const MatDB = require('./MatDB');

let AnalyzerSchema = new Schema({
    eIn: {
        type: Array,
        default: [0] * 30
    },
    eDes: {
        type: Array,
        default: [0] * 30
    },
    weights: {
        accuracy: 0,
        weight: 0,
        size: 0,
        cost: 0,
    },
    eOut: {
        type: Array,
        default: [0] * 30
    },
    curDiff: {
        type: Number,
    },
    curMats: {
        type: Array,
    },
    matDict: MatDB.schema,
    matsAvail: [Mat.schema],
    matsAvailNames: {type: Array},
    iteration: {
        type: Number,
        default: 0
    },
    algorithm: {
        type: String,
        default: 'BruteForce'
    },
    weightsChanged: {
        type: Boolean,
        default: false,
    },
    running: {
        type: Boolean,
        default: true,
    },
});

module.exports = Analyzer = mongoose.model('analyzer', AnalyzerSchema);