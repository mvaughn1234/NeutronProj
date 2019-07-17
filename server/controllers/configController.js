const Config = require('../models/Config');
const { spawn } = require('child_process');

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

runConfig = (config) => {
    const matList = `-mats=${config.matList.join(',')}`;
    const lenList = `-lens=${config.lenList.join(',')}`;
    const energy = `-En=${config.energyLow}${config.scale}-${config.energyHigh}${config.scale}`;
    const genData = spawn('./../../scripts/rb_scripts/gen_data.rb',[matList,lenList,energy]);
};

exports.runConfig = (req,res) => {
    Config.findById(req.params.id)
        .then(config => this.runConfig(config))
        .then(res.status(200).send('running configs'))
        .catch(err => res.status(500).send(err));
};