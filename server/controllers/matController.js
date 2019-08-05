const Mat = require('../models/Mat');

exports.getMatList = (req, res) => {
    Mat.find()
        .then(mats => res.json(mats));
};

exports.getMat = (req, res) => {
    Mat.find({name: req.params.name})
        .then(mat => res.json(mat))
        .catch(err => res.status(500).send(err));
    // res.json(req.mat);
};

exports.addMat = (req, res) => {
    const newMat = new Mat(req.body);
    newMat.save();
    res.status(201).send(newMat);
};

exports.editMat = (req, res) => {
    Mat.find({name: req.params.name}).update({$set: req.body}, {useFindAndModify: false})
        .then(mat => {
            console.log(req.params.id);
            res.json(mat);
        })
        .catch(err => {
            res.status(400).send(err);
        })
};

exports.deleteMat = (req, res) => {
    Mat.find({name: req.params.name})
        .then(mat => {
            mat.remove()
                .then(() => {
                    res.status(204).send('removed');
                })
        })
        .catch(err => {
            res.status(500).send(err)
        });
};