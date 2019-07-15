const express = require('express');
const settingRouter = express.Router();
const Setting = require('../../../models/Setting');
const settingController = require('../../../controllers/settingController');

settingRouter.use('/', (req, res, next)=>{
    console.log("Setting router start");

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

settingRouter.route('/').get(settingController.getSetting);
settingRouter.route('/set').post(settingController.setSetting);

module.exports = settingRouter;