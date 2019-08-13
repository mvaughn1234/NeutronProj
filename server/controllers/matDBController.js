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
    MatDB.find({'mat.name': 'moly', 'data': {'$elemMatch': {len: req.params.length, 'lenSet': {'$elemMatch': {eIn: req.params.eIn}}}}})
        .then(matDB1 => {
            if (matDB1.length === 0) {
                MatDB.find({'mat.name': req.params.name, 'data': {'$elemMatch': {len: req.params.length}}})
                    .then(matDB => {
                        console.log('matDB', matDB);
                        if (matDB.length === 0) {
                            MatDB.find({'mat.name': req.params.name})
                                .then(matDB2 => {
                                    if (matDB2.length === 0) {
                                        Mat.find({"name": req.params.name})
                                            .then(mat => {
                                                if (mat.length === 0) {
                                                    res.status(502).send(err)
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
                                    } else {
                                        const lenSet = {len: req.params.length, lenSet: [req.body]};
                                        MatDB.update({'mat.name': req.params.name},
                                            {$push: {'data': lenSet}})
                                            .then(matDB => {
                                                const msg = 'Adding new len set to ' + req.params.name + ' database';
                                                console.log(msg);
                                                res.status(200).send(msg)
                                            })
                                            .catch(err => res.status(503).send(err))
                                    }
                                })
                        } else {
                            console.log('here');
                            MatDB.update({'mat.name': req.params.name, 'data': {'$elemMatch': {len: req.params.length}}},
                                {$push: {'data.$.lenSet': req.body}})
                                .then(matDB => {
                                    const msg = 'Adding new data set to ' + req.params.name + ' lenSet at length ' + req.params.length;
                                    console.log(msg);
                                    res.status(200).send(msg)
                                })
                                .catch(err => res.status(504).send(err))
                        }
                    })
            } else {
                // MatDB.find({'mat.name': 'moly', 'data': {'$elemMatch': {len: req.params.length, 'lenSet': {'$elemMatch': {eIn: req.params.eIn}}}}},
                //     {$set: {'data.$.lenSet.$.eOut': req.body.eOut, 'data.$.lenSet.$.bins': req.body.bins}})
                //     .then(matDB => {
                //         const msg = 'Adding new data set to ' + req.params.name + ' lenSet at length ' + req.params.length;
                //         console.log(msg);
                //         res.status(200).send(msg)
                //     })
                //     .catch(err => res.status(505).send(err))
                let temp = matDB1.data.filter(lenSet => lenSet.len === req.params.length && lenSet.lenSet.includes({'eIn': req.params.eIn})).lenSet.filter(eSet => eSet.eIn === req.params.eIn)
                console.log('filtered: ', temp)

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