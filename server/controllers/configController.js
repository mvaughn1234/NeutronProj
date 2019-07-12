const Config = require('../models/Config');

exports.getConfigList = (req,res) => {
    Config.find()
        .then(configs => res.json(configs));
};

exports.getConfig = (req,res) => {
    Config.findById(req.params.id)
        .then(config => res.json(config))
        .catch(err => res.status(500).send(err));
    // res.json(req.config);
};

exports.addConfig = (req,res) => {
    const newConfig = new Config(req.body);
    newConfig.save();
    res.status(201).send(newConfig);
};

exports.editConfig = (req,res) => {
    Config.findByIdAndUpdate(req.params.id, {$set: req.body}, {useFindAndModify: false})
        .then(config => {
            console.log(req.params.id);
            res.json(config);
        })
        .catch(err => {
            res.status(400).send(err);
        })
};

exports.deleteConfig = (req,res) => {
    Config.findById( req.params.id)
        .then(config => {
            config.remove()
                .then(() => {res.status(204).send('removed');})
        })
        .catch(err => res.status(500).send(err));
};