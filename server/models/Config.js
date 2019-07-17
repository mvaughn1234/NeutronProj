const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mat = require('./Mat');

let ConfigSchema = new Schema({
    matList: [Mat.schema],
    eIn: {type: Number, required: true},
    runSet: {type: String, required: true}
});

module.exports = Config = mongoose.model('config', ConfigSchema);