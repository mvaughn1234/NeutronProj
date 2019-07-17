const Setting = require('../models/Setting');

const checkSetting = (settings) => {
    if (settings.length === 0){
        const setting = new Setting({
            matList: [{name: 'tin', installed: true, color:'#6dbf88'},
                {name: 'moly', installed: true, color:'#b28034'},
                {name: 'graphite', installed: true, color:'#b7b7b7'},
                {name: 'bh303', installed: true, color:'#bf5bac'},
                {name: 'beryllium', installed: true, color:'#4673be'}],
            settings: [
                {
                    title: 'Set Scale',
                    description: 'Scale to partition energy bins by',
                    input: 'Button',
                    options: ['Base10', 'Log'],
                    currentValue: 'Log'
                },
                {
                    title: 'Energy Min',
                    description: 'Minimal energy input to geant simulations.',
                    input: 'energy1',
                    options: [],
                    currentValue: '3.0'
                },
                {
                    title: 'Energy Max',
                    description: 'Maximal energy input to geant simulations.',
                    input: 'energy2',
                    options: [],
                    currentValue: '14.1'
                },
                {
                    title: 'Num Bins',
                    description: 'Number of partitions on energy scale.',
                    input: 'number',
                    options: [],
                    currentValue: '30'
                },
                {
                    title: 'Num Processes',
                    description: 'Maximum number of processes on carbon that should be used',
                    input: 'number',
                    options: [],
                    currentValue: '10'
                },
                {
                    title: 'Precision',
                    description: 'Number of neutrons fired during simulation',
                    input: 'number',
                    options: [],
                    currentValue: '1000'
                },
                {
                    title: 'Data Directory',
                    description: 'Directory to log data to.',
                    input: 'Path',
                    options: [],
                    currentValue: './data/data'
                },
                {
                    title: 'Log Directory',
                    description: 'Directory to log logfiles to.',
                    input: 'Path',
                    options: [],
                    currentValue: './data/log'
                },
                {
                    title: 'Geant Location',
                    description: 'Run geant on carbon or locally.',
                    input: 'Button',
                    options: ['Local','Carbon'],
                    currentValue: 'Carbon'
                },
            ]
        });
        setting.save();
        return setting;
    }else{
        return settings;
    }
};

exports.getSetting = (req,res) => {
    Setting.find()
        .then(setting => checkSetting(setting))
        .then(setting => res.json(setting));
};

exports.setSetting = (req,res) => {
    Setting.deleteMany({}, callback);
    const newProp = new Setting(req.body);
    newProp.save();
    res.status(200).send(newProp);
};