const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mat = require('./Mat');
const LenSet = require('./LenSet');


const MatDBSchema = new Schema({
    mat: Mat.schema,
    data: [LenSet.schema]
});

const MatDB = mongoose.model('matDB', MatDBSchema);
module.exports = MatDB;