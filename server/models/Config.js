const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mat = require('./Mat');

let ConfigSchema = new Schema({
    mode: {type: String, required: true},
    matList: [Mat.schema],
    lenList: [{type: Object, required: true}],
    flags: [{type: String, required: false}],
    runSet: {type: String, required: false}
});

module.exports = Config = mongoose.model('config', ConfigSchema);