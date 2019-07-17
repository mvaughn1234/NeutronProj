const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mat = require('./Mat');
const DataSet = require('./DataSet');


const MatDBSchema = new Schema({
    Mat: Mat.schema,
    dataSets: [DataSet.schema]
});

const MatDB = mongoose.model('matDB', MatDBSchema);
module.exports = MatDB;