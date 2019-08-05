const MatDB = require('../models/MatDB');
const Mat = require('../models/Mat');

exports.getMatDBList = (req, res) => {
    MatDB.find()
        .then(matDBs => res.json(matDBs));
};

exports.getMatDB = (req, res) => {
    MatDB.find({'mat.name': req.params.name})
        .then(matDB => res.json(matDB))
        .catch(err => res.status(500).send(err));
};

exports.addDataSet = (req, res) => {
    MatDB.find({'mat.name': req.params.name, 'data.len': req.params.length})
        .then(matDB => {
            console.log('matDB', matDB);
            if (matDB.length === 0) {
                MatDB.find({'mat.name': req.params.name})
                    .then(matDB2 => {
                        if (matDB2.length === 0) {
                            Mat.find({"name": req.params.name})
                                .then(mat => {
                                    if (mat.length === 0) {
                                        res.status(500).send("Couldn't find material")
                                    } else {
                                        const lenSet = {len: req.params.length, lenSet: [req.body]};
                                        const newDB = {mat: mat[0], data: [lenSet]};
                                        const newMatDB = new MatDB(newDB);
                                        newMatDB.save();
                                        const msg = 'Adding new mat database: ' + req.params.name;
                                        console.log(msg);
                                        res.status(201).send(msg)
                                    }
                                })
                        }else{
                            const lenSet = {len: req.params.length, lenSet: [req.body]};
                            MatDB.update({'mat.name': req.params.name},
                                {$push: {'data': lenSet}})
                                .then(matDB => {
                                    const msg = 'Adding new len set to ' + req.params.name + ' database';
                                    console.log(msg);
                                    res.status(200).send(msg)
                                })
                                .catch(err => res.status(500).send(err))
                        }
                    })
            } else {
                console.log('here');
                MatDB.update({'mat.name': req.params.name, 'data.len': req.params.length},
                    {$push: {'data.$.lenSet': req.body}})
                    .then(matDB => {
                        const msg = 'Adding new data set to ' + req.params.name + ' lenSet at length ' + req.params.length;
                        console.log(msg);
                        res.status(200).send(msg)
                    })
                    .catch(err => res.status(500).send(err))
            }
        })
};

exports.deleteMatDB = (req, res) => {
    MatDB.find({'mat.name': req.params.name, 'data.length': req.params.length})
        .then(matDB => {
            matDB.data.length(req.params.length).remove();
            matDB.save()
                .then(() => {
                    res.status(204).send('removed');
                })
        })
        .catch(err => res.status(500).send(err));
};