const Mat = require('../models/Mat');

const checkMatList = (mats) => {
    if (mats.length === 0){
        const tin = new Mat({name: 'tin', installed: true, color:'#6dbf88'});
        const moly = new Mat({name: 'moly', installed: true, color:'#b28034'});
        const graphite = new Mat({name: 'graphite', installed: true, color:'#b7b7b7'});
        const bh303 = new Mat({name: 'bh303', installed: true, color:'#bf5bac'});
        const beryllium = new Mat({name: 'beryllium', installed: true, color:'#4673be'});
        tin.save();
        moly.save();
        graphite.save();
        bh303.save();
        beryllium.save();
        return [tin,moly,graphite,bh303,beryllium];
    }else{
        return mats;
    }
};

exports.getMatList = (req, res) => {
    Mat.find()
        .then(mats => checkMatList(mats))
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