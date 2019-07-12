const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mat = require('./Mat');

// allowedScales: {title: String, description: String, data: {type: Array, default: ['log', 'base10']},
//     precision: {type: Number, min: 1000, max: 100000, default: 1000},
//     processes: {type: Number, min: 1, max: 40, default: 20},
//     length: {type: Number, min: 1, max: 100, default: 10},
//     numBins: {type: Number, min: 3, max: 30, default: 30},
// }

const settingSchema = new Schema({
    title: {type: String, default: 'Default Prop:', unique: true},
    description: {type: String, default: 'Default Description:'},
    input: {type: String, default: 'Button'},
    options: {type: Array, default: ['Opt1','Opt2']},
    currentValue: {}
});

const PropsSchema = new Schema({
    matList: [Mat.schema],
    settings: [settingSchema]
});

const Props = mongoose.model('props', PropsSchema);
module.exports = Props;