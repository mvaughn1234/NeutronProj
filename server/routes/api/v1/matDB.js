const express = require('express');
const matDBRouter = express.Router();
const matDBController = require('./../../../controllers/matDBController');

matDBRouter.use('/', (req, res, next)=>{
    console.log("matDB router start");

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

matDBRouter.route('/').get(matDBController.getMatDBList);
matDBRouter.route('/:name').get(matDBController.getMatDB);
matDBRouter.route('/:name/:length/:eIn/add').put(matDBController.addDataSet);
// matDBRouter.route('/:mat/edit').put(matDBController.editMatDB);
matDBRouter.route('/:name/:length/:eIn/delete').delete(matDBController.deleteMatDB);

module.exports = matDBRouter;