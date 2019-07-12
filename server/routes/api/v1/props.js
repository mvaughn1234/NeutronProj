const express = require('express');
const propsRouter = express.Router();
const Props = require('./../../../models/Props');
const propsController = require('./../../../controllers/propsController');

propsRouter.use('/', (req, res, next)=>{
    console.log("Props router start");

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

propsRouter.route('/').get(propsController.getProps);
propsRouter.route('/set').post(propsController.setProps);

module.exports = propsRouter;