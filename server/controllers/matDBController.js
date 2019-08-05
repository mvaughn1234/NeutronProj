const MatDB = require('../models/MatDB');
const Mat = require('../models/Mat');

exports.getMatDBList = (req,res) => {
    MatDB.find()
        .then(matDBs => res.json(matDBs));
};

exports.getMatDB = (req,res) => {
    MatDB.find({'mat.name': req.params.name})
        .then(matDB => res.json(matDB))
        .catch(err => res.status(500).send(err));
};

exports.addDataSet = (req,res) => {
    MatDB.find({'mat.name': req.params.name, 'data.length': req.params.length})
        .then(matDB => {
            if (matDB.length === 0){
                Mat.find({"name": req.params.name})
                    .then(mat => {
                        if (mat.length === 0){
                            res.status(500).send("Couldn't find material")
                        }else{
                            const lenSet = {length: req.params.length, lenSet: [req.body]};
                            const newDB = {mat: mat[0], data: [lenSet]};
                            const newMatDB = new MatDB(newDB);
                            newMatDB.save();
                            res.stats(201).send(newMatDB);
                        }
                    })
            }else{
                MatDB.update({'mat.name': req.params.name, 'data.length': req.params.length},
                    {$push: {'data.$.lenSet': req.body}})
                    .then(matDB => res.json(matDB))
                    .catch(err => res.stats(500).send(err))
            }
        })
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