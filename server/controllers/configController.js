const Config = require('../models/Config');
const Setting = require('../models/Setting');
const genData = require('./../scripts/genData');
const {spawn} = require('child_process');
const carbonUser = require('./../config/keys').sshKeys.carbonUser;
const carbonPass = require('./../config/keys').sshKeys.carbonPass;
const rb_gen_path = require('./../config/directories').sshPaths.rb_gen_path;
const rb_gen_path_local = require('./../config/directories').paths.rb_gen_path;
const io = require('socket.io');
const logspace = require('logspace');
const linspace = require('linspace');
const fs = require('fs');
const path = require('path');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const Client = require('ssh2').Client;

exports.getConfigList = (req, res) => {
    Config.find()
        .then(configs => res.json(configs));
};

exports.getConfig = (req, res) => {
    Config.findById(req.params.id)
        .then(config => res.json(config))
        .catch(err => res.status(500).send(err));
    // res.json(req.config);
};

exports.addConfig = (req, res) => {
    const newConfig = new Config(req.body);
    newConfig.save();
    res.status(201).send(newConfig);
};

exports.editConfig = (req, res) => {
    Config.findByIdAndUpdate(req.params.id, {$set: req.body}, {useFindAndModify: false})
        .then(config => {
            console.log(req.params.id);
            res.json(config);
        })
        .catch(err => {
            res.status(400).send(err);
        })
};

exports.deleteConfig = (req, res) => {
    Config.findById(req.params.id)
        .then(config => {
            config.remove()
                .then(() => {
                    res.status(204).send('removed');
                })
        })
        .catch(err => {
            res.status(500).send(err)
        });
};
//
// .then(config => {
//     console.log('made it here');
//     console.log('config mode: ', config.mode);
//     if (config.mode === 'single') {
//         console.log('made it here2');
//         const matList = `-mats=${config.matList.map(mat => mat.name).join(',')}`;
//         const lenList = `-lens=${config.lenList.map(len => {
//             return len.single ? len.min : `${len.min}-${len.max}:${len.part}`;
//         }).join(',')}`;
//         console.log('made it here3');
//         Setting.find().then(data => data[0]).then(settings => {
//             console.log('made it here4');
//             console.log('Settings: ', settings.settings.filter(element => element.title === 'Energy Min')[0].currentValue);
//             const eLow = Number(settings.settings.filter(element => element.title === 'Energy Min')[0].currentValue) * (10 ** -3);
//             const eHigh = Number(settings.settings.filter(element => element.title === 'Energy Max')[0].currentValue);
//             const numBins = Number(settings.settings.filter(element => element.title === 'Num Bins')[0].currentValue);
//             const scale = settings.settings.filter(element => element.title === 'Set Scale')[0].currentValue;
//             console.log('made it here5');
//             const energy = `-En=${eLow}-${eHigh}:${numBins}@${scale}`;
//             const flags = config.flags.join(',');
//             console.log('made it here6');
//             try {
//                 let runPhrase = `ruby ${rb_gen_path_local} ${matList} ${lenList} ${energy} ${flags}`;
//                 console.log(runPhrase);
//                 // const genData = spawn(`sshpass -p ${carbonPass} ssh ${carbonUser}@carbon444.umm.edu ruby ${rb_gen_path}`, [matList, lenList, energy, flags]);
//                 const genData = spawn(`ruby ${rb_gen_path_local}`, [matList, lenList, energy, flags]);
//                 genData.stdout.on('data', (data) => {
//                     console.log(`stdout: ${data}`);
//                 });
//
//                 genData.stderr.on('data', (data) => {
//                     console.log(`stderr: ${data}`);
//                 });
//
//                 genData.on('close', (code) => {
//                     console.log(`child process exited with code ${code}`);
//                 });
//
//                 genData.on('error', (err) => {
//                     console.log(`failed to start data generation with error ${err}`);
//                 });
//             } catch (err) {
//                 console.log(err);
//             }
//         })
//             .then(res.status(200).send('running configs'));
//     }
// })

let exportToJsonFile = (jsonData) => {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('configs', exportFileDefaultName);
    linkElement.click();
};

let transpose = m => m[0].map((x, i) => m.map(x => x[i]));


exports.runConfigs = (io, Configs) => {
    let promises = Configs.map(configID => {
        return Config.findById(configID)
            .then(config => {
                let configObj = {configs: []};
                if (config.mode === 'single') {
                    const matList = config.matList.map(mat => mat.name);
                    const lenList = config.lenList.map(len => {
                        return len.single ? [Number(len.min)] : linspace(Number(len.min), Number(len.max), Number(len.part));
                    });
                    const longestList = lenList.reduce((acc, cur) => cur.length > acc ? cur.length : acc, 0);
                    const lenListAltered = longestList > 1 ? lenList.map((lenListSingle) => {
                        console.log(lenListSingle, lenListSingle.length);
                        lenListSingle.length === 1 ? [...Array(longestList).keys()].map(i => lenListSingle) : lenListSingle;
                    }) : [[].concat.apply([], lenList)];
                    const transposed = longestList > 1 ? transpose(lenListAltered) : lenListAltered;
                    return Setting.find().then(data => data[0]).then(settings => {
                        const eLow = Number(settings.settings.filter(element => element.title === 'Energy Min')[0].currentValue) * (10 ** -3);
                        const eHigh = Number(settings.settings.filter(element => element.title === 'Energy Max')[0].currentValue);
                        const numBins = Number(settings.settings.filter(element => element.title === 'Num Bins')[0].currentValue);
                        const scale = settings.settings.filter(element => element.title === 'Set Scale')[0].currentValue;
                        const energy = scale === 'Log' ? logspace(eLow * (10 ** -3), eHigh, numBins) : linspace(eLow * (10 ** 3), eHigh, numBins);
                        const flags = config.flags.join(',');
                        transposed.forEach(lenSet => {
                            energy.forEach(en => {
                                configObj.configs.push({matList: matList, lenList: lenSet, energy: en});
                            })
                        });
                        return configObj;
                    })
                }
            })
    });

    Promise.all(promises).then(configSet => {
        let data = JSON.stringify(configSet);
        let curseconds = Date.now();
        let carbonJSONPath = `/home/${carbonUser}/geant4/NeutronProj/JSON/configs/`;
        let tempPath = './temp/'
        let docName = `config-${curseconds}.json`;
        let localPath = tempPath + docName;
        let carbonPath = carbonJSONPath + docName;
        fs.open(localPath, 'w', function (err, fd) {
            if (err) {
                throw 'could not open file: ' + err;
            }

            fs.write(fd, data, 0, 'utf8', function (err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function () {
                    console.log('write the file successfully');
                })
            })
        });

        const conn = new Client();
        conn.on('ready', function() {
            conn.sftp(function(err, sftp) {
                if (err) throw err;

                const readStream = fs.createReadStream( localPath );
                const writeStream = sftp.createWriteStream( carbonPath );

                writeStream.on('close',function () {
                    console.log( "- file transferred succesfully" );
                    conn.exec(`ruby /home/student/geant4/NeutronProj/scripts/rb_scripts/generateData.rb ${carbonPath}`, function(err, stream) {
                        if (err) throw err;
                        stream.on('close', function(code, signal) {
                            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                            conn.end();
                        }).on('data', function(data) {
                            console.log('STDOUT: ' + data);
                        }).stderr.on('data', function(data) {
                            console.log('STDERR: ' + data);
                        });
                    });
                });

                writeStream.on('end', function () {
                    console.log( "sftp connection closed" );
                    conn.close();
                });

                // initiate transfer of file
                readStream.pipe( writeStream );
            });
        }).connect({
            host: 'carbon444.umm.edu',
            username: 'student',
            password: 'ccstdnt1'
        });
    })
};