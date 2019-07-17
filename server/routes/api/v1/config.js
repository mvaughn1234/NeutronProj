const express = require('express');
const configRouter = express.Router();
const configController = require('./../../../controllers/configController');

configRouter.use('/', (req, res, next)=>{
    console.log("config router start");

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

configRouter.route('/').get(configController.getConfigList);
configRouter.route('/:id').get(configController.getConfig);
configRouter.route('/new').post(configController.addConfig);
configRouter.route('/:id/edit').put(configController.editConfig);
configRouter.route('/:id/delete').delete(configController.deleteConfig);
configRouter.route('/:id/run').delete(configController.runConfig);

module.exports = configRouter;
