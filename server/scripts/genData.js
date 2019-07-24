const Config = require('../models/Config');
const Setting = require('../models/Setting');
const {spawn} = require('child_process');
const carbonUser = require('./../config/keys').sshKeys.carbonUser;
const carbonPass = require('./../config/keys').sshKeys.carbonPass;
const rb_gen_path = require('./../config/directories').sshPaths.rb_gen_path;
const rb_gen_path_local = require('./../config/directories').paths.rb_gen_path;

exports.runConfig = (config) => {
    console.log('made it here');
    console.log('config mode: ', config.mode);
    if (config.mode === 'single') {
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
            } catch (err) {
                console.log(err);
            }
        })
            .then(res.status(200).send('running configs'));
    }
};