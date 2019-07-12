const MatDB = require('../models/MatDB');

exports.getMatDBList = (req,res) => {
    MatDB.find()
        .then(matDBs => res.json(matDBs));
};

exports.getMatDB = (req,res) => {
    MatDB.find({mat: req.params.mat})
        .then(matDB => res.json(matDB))
        .catch(err => res.status(500).send(err));
};

exports.createMatDB = (req,res) => {
    const newMatDB = new MatDB(req.body);
    newMatDB.save();
    res.status(201).send(newMatDB);
};

exports.addDataSet = (req,res) => {
    MatDB.find({mat: req.params.mat}).update({$push: {dataSets: req.body}})
        .then(matDB => {
            console.log(req.params.mat);
            res.json(matDB);
        })
        .catch(err => {
            res.status(400).send(err);
        })
};

exports.deleteMatDB = (req,res) => {
    MatDB.find({mat: req.params.mat})
        .then(matDB => {
            matDB.remove()
                .then(() => {res.status(204).send('removed');})
        })
        .catch(err => res.status(500).send(err));
};