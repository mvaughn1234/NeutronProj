const Props = require('../models/Props');

exports.getProps = (req,res) => {
    Props.find()
        .then(propSets => res.json(propSets));
};

exports.setProps = (req,res) => {
    Props.deleteMany({}, callback);
    const newProp = new Props(req.body);
    newProp.save();
    res.status(200).send(newProp);
};