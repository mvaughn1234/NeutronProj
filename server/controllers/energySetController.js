const Setting = require('../models/EnergySet');

exports.getEnergySetList = (req,res) => {
    EnergySet.find()
        .then(energySets => res.json(energySets));
};

exports.getEnergySet = (req,res) => {
    EnergySet.findById(req.params.id)
        .then(energySet => res.json(energySet))
        .catch(err => res.status(500).send(err));
    // res.json(req.energySet);
};

exports.addEnergySet = (req,res) => {
    const newEnergySet = new EnergySet(req.body);
    newEnergySet.save();
    res.status(201).send(newEnergySet);
};

exports.editEnergySet = (req,res) => {
    EnergySet.findByIdAndUpdate(req.params.id, {$set: req.body}, {useFindAndModify: false})
        .then(energySet => {
            console.log(req.params.id);
            res.json(energySet);
        })
        .catch(err => {
            res.status(400).send(err);
        })
};

exports.deleteEnergySet = (req,res) => {
    EnergySet.findById( req.params.id)
        .then(energySet => {
            energySet.remove()
                .then(() => {res.status(204).send('removed');})
        })
        .catch(err => {res.status(500).send(err)});
};