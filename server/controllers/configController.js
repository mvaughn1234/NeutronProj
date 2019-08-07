const Config = require('../models/Config');
const Setting = require('../models/Setting');
const genData = require('./../scripts/genData');
const {spawn, execFile} = require('child_process');
const carbonUser = require('./../config/keys').sshKeys.carbonUser;
const carbonPass = require('./../config/keys').sshKeys.carbonPass;
const rb_gen_path = require('./../config/directories').sshPaths.rb_gen_path;
const rb_gen_path_local = require('./../config/directories').paths.rb_gen_path;
// const io = require('socket.io');
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


exports.runConfigs = (socket, Configs) => {
    let eLow, eHigh, numBins, precision, procCount, scale, energy;
    let promises = Setting.find().then(data => data[0]).then(settings => {
        eLow = Number(settings.settings.filter(element => element.title === 'Energy Min')[0].currentValue) * (10 ** -3);
        eHigh = Number(settings.settings.filter(element => element.title === 'Energy Max')[0].currentValue);
        numBins = Number(settings.settings.filter(element => element.title === 'Num Bins')[0].currentValue);
        precision = Number(settings.settings.filter(element => element.title === 'Precision')[0].currentValue);
        procCount = Number(settings.settings.filter(element => element.title === 'Num Processes')[0].currentValue);
        scale = settings.settings.filter(element => element.title === 'Set Scale')[0].currentValue;
        energy = scale === 'Log' ? logspace(Math.log10(eLow), Math.log10(eHigh), numBins) : linspace(eLow, eHigh, numBins);
        return Configs.map(configID => {
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
                                let tempVar = lenListSingle.length;
                                let ret;
                                lenListSingle.length === 1 ? ret = [...Array(longestList).keys()].map(i => {
                                        return lenListSingle[0]
                                    })
                                    : ret = lenListSingle;
                                return ret
                            })
                            : [[].concat.apply([], lenList)];
                        const transposed = longestList > 1 ? transpose(lenListAltered) : lenListAltered;
                        transposed.forEach(lenSet => {
                            energy.forEach(en => {
                                configObj.configs.push({matList: matList, lenList: lenSet, energy: en});
                            })
                        });
                        return configObj;
                    }
                })
        });
    });

    promises.then(configs =>
        Promise.all(configs).then(configSet => {
            let temp = [{
                'geantProps': {
                    'procCount': procCount,
                    'precision': precision,
                    'energyMin': eLow,
                    'energyMax': eHigh,
                    'numBins': numBins,
                    'scale': scale
                }
            }, ...configSet];
            let data = JSON.stringify(temp);
            let curseconds = Date.now();
            //     REMOTE:
            //     let carbonJSONPath = `/home/${carbonUser}/geant4/NeutronProj/JSON/configs/`;
            //     let tempPath = './temp/';
            //     let docName = `config-${curseconds}.json`;
            //     let localPath = tempPath + docName;
            //     let carbonPath = carbonJSONPath + docName;
            //     fs.open(localPath, 'w', function (err, fd) {
            //         if (err) {
            //             throw 'could not open file: ' + err;
            //         }
            //
            //         fs.write(fd, data, 0, 'utf8', function (err) {
            //             if (err) throw 'error writing file: ' + err;
            //             fs.close(fd, function () {
            //                 console.log('write the file successfully');
            //             })
            //         })
            //     });
            //
            //     const conn = new Client();
            //     conn.on('ready', function () {
            //         conn.sftp(function (err, sftp) {
            //             if (err) throw err;
            //
            //             const readStream = fs.createReadStream(localPath);
            //             const writeStream = sftp.createWriteStream(carbonPath);
            //
            //             writeStream.on('close', function () {
            //                 console.log("- file transferred succesfully");
            //                 conn.exec(`. /home/ubuntu/Downloads/geant/build/geant4make.sh; python /home/student/geant4/NeutronProj/scripts/py_scripts/runGenerateConfigs.py ${carbonPath}`, function (err, stream) {
            //                     if (err) throw err;
            //                     stream.on('close', function (code, signal) {
            //                         console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            //                         conn.end();
            //                     }).on('data', function (data) {
            //                         console.log('STDOUT: ' + data);
            //                     }).stderr.on('data', function (data) {
            //                         console.log('STDERR: ' + data);
            //                     });
            //                 });
            //             });
            //
            //             writeStream.on('end', function () {
            //                 console.log("sftp connection closed");
            //                 conn.close();
            //             });
            //
            //             // initiate transfer of file
            //             readStream.pipe(writeStream);
            //         });
            //     }).connect({
            //         host: 'carbon444.umm.edu',
            //         username: 'student',
            //         password: 'ccstdnt1'
            //     });
            // }));
            //     LOCAL:
            let jsonPath = '/home/student/geant4/NeutronProj/JSON/configs/';
            let docName = `config-${curseconds}.json`;
            let fullPath = jsonPath + docName;
            fs.open(fullPath, 'w', function (err, fd) {
                if (err) {
                    throw 'could not open file: ' + err;
                }

                fs.write(fd, data, 0, 'utf8', function (err) {
                    if (err) throw 'error writing file: ' + err;
                    fs.close(fd, function () {
                        console.log('wrote the file successfully');
                    })
                })
            });;//a

            const generator = execFile('python3', ['/home/student/geant4/NeutronProj/scripts/py_scripts/runGenerateConfigs.py', fullPath], {env: 'G410'}, (err, stdout, stderr) => {
                if (err) {
                    socket.emit('runConfigsClient', 'exited with err: ' + err);
                    console.log(`generator exited with code ${err}`)
                }
                socket.emit('runConfigsClient', 'stdout: ' + stdout);
                console.log(`stdout: ${stdout}`)

                socket.emit('runConfigsClient', 'stderr: ' + stderr);
                console.log(`stderr: ${stderr}`)
            });
        }));
};