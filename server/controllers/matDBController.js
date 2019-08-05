const MatDB = require('../models/MatDB');

exports.getMatDBList = (req,res) => {
    MatDB.find()
        .then(matDBs => res.json(matDBs));
};

exports.getMatDB = (req,res) => {
    MatDB.find({'mat.name': req.params.name})
        .then(matDB => res.json(matDB))
        .catch(err => res.status(500).send(err));
};

exports.createMatDB = (req,res) => {
    const newMatDB = new MatDB(req.body);
    newMatDB.save();
    res.status(201).send(newMatDB);
};

exports.addDataSet = (req,res) => {
    MatDB.update({'mat.name': req.params.name, 'data.length': req.params.length},
        {$push: {'data.$.lenSet': req.body.data}})
        .then(matDB => res.json(matDB))
        .catch(err => res.stats(500).send(err))
};

exports.deleteMatDB = (req,res) => {
    MatDB.find({'mat.name': req.params.name, 'data.length': req.params.length})
        .then(matDB => {
            matDB.data.length(req.params.length).remove();
            matDB.save()
                .then(() => {res.status(204).send('removed');})
        })
        .catch(err => res.status(500).send(err));
};