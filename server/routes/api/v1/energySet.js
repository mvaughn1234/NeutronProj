const express = require('express');
const energySetRouter = express.Router();
const energySetController = require('./../../../controllers/energySetController');

energySetRouter.use('/', (req, res, next)=>{
    console.log("energySet router start");

    //Request vs Params parameters
    //If you want to identify a resource, you should use Path Variable.
    // But if you want to sort or filter items, then you should use query parameter.

    for (const key in req.query) {
        console.log(key, req.query[key])
        console.log(req.params)
    }
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    next();
});

energySetRouter.route('/').get(energySetController.getEnergySetList);
energySetRouter.route('/:id').get(energySetController.getEnergySet);
energySetRouter.route('/new').post(energySetController.addEnergySet);
energySetRouter.route('/:id/edit').put(energySetController.editEnergySet);
energySetRouter.route('/:id/delete').delete(energySetController.deleteEnergySet);

module.exports = energySetRouter;
