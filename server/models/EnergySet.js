const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnergySetSchema = new Schema({
    data: [{type: Number, required: true}]
});

module.exports = EnergySet = mongoose.model('energySet', EnergySetSchema);