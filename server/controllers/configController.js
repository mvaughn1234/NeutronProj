const Config = require('../models/Config');
const Setting = require('../models/Setting');
const { spawn } = require('child_process');
const carbonUser = require('./../config/keys').sshKeys.carbonUser;
const carbonPass = require('./../config/keys').sshKeys.carbonPass;
const rb_gen_path = require('./../config/directories').sshPaths.rb_gen_path;
const rb_gen_path_local = require('./../config/directories').paths.rb_gen_path;

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
        .catch(err => {res.status(500).send(err)});
};

exports.runConfig = (req,res) => {
    Config.findById(req.params.id)
        .then(config => {
            console.log('made it here');
            console.log('config mode: ', config.mode);
            if(config.mode === 'single') {
                console.log('made it here2');
                const matList = `-mats=${config.matList.map(mat => mat.name).join(',')}`;
                const lenList = `-lens=${config.lenList.map(len => {
                    return len.single ? len.min : `${len.min}-${len.max}:${len.part}`;
                }).join(',')}`;
                console.log('made it here3');
                Setting.find().then(data => data[0]).then(settings => {
                    console.log('made it here4');
                    console.log('Settings: ', settings.settings.filter(element => element.title === 'Energy Min')[0].currentValue);
                    const eLow = Number(settings.settings.filter(element => element.title === 'Energy Min')[0].currentValue) * (10 ** -3);
                    const eHigh = Number(settings.settings.filter(element => element.title === 'Energy Max')[0].currentValue);
                    const numBins = Number(settings.settings.filter(element => element.title === 'Num Bins')[0].currentValue);
                    const scale = settings.settings.filter(element => element.title === 'Set Scale')[0].currentValue;
                    console.log('made it here5');
                    const energy = `-En=${eLow}-${eHigh}:${numBins}@${scale}`;
                    const flags = config.flags.join(',');
                    console.log('made it here6');
                    try {
                        let runPhrase = `ruby ${rb_gen_path_local} ${matList} ${lenList} ${energy} ${flags}`;
                        console.log(runPhrase);
                        // const genData = spawn(`sshpass -p ${carbonPass} ssh ${carbonUser}@carbon444.umm.edu ruby ${rb_gen_path}`, [matList, lenList, energy, flags]);
                        const genData = spawn(`ruby ${rb_gen_path_local}`, [matList, lenList, energy, flags]);
                        genData.stdout.on('data', (data) => {
                            console.log(`stdout: ${data}`);
                        });

                        genData.stderr.on('data', (data) => {
                            console.log(`stderr: ${data}`);
                        });

                        genData.on('close', (code) => {
                            console.log(`child process exited with code ${code}`);
                        });

                        genData.on('error', (err) => {
                            console.log(`failed to start data generation with error ${err}`);
                        });
                    }catch(err){
                        console.log(err);
                    }
                })
                    .then(res.status(200).send('running configs'));
            }
        })
        .catch(err => res.status(500).send(err));
};