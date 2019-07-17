const Setting = require('../models/Setting');

const checkSetting = (settings) => {
    if (settings.length === 0){
        const Setting = new Setting({
            matList: [{name: 'tin', installed: true},
                {name: 'moly', installed: true},
                {name: 'graphite', installed: true},
                {name: 'bh303', installed: true},
                {name: 'beryllium', installed: true}],
            settings: [
                {
                    title: 'Set Scale',
                    description: 'temp',
                    input: 'Button',
                    options: ['Base10', 'Log'],
                    currentValue: 'Base10'
                },
                {
                    title: 'Set Scale2',
                    description: 'temp',
                    input: 'Button',
                    options: ['Base10', 'Log'],
                    currentValue: 'Base10'
                },
                {
                    title: 'Set Scale3',
                    description: 'temp',
                    input: 'Button',
                    options: ['Base10', 'Log'],
                    currentValue: 'Base10'
                }
            ]
        });
        Setting.save();
        return Setting;
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