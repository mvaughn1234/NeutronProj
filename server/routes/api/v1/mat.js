const express = require('express');
const matRouter = express.Router();
const matController = require('./../../../controllers/matController');

matRouter.use('/', (req, res, next)=>{
    console.log("mat router start");
    console.log('time: ', Date());
    //Request vs Params parameters
    //If you want to identify a resource, you should use Path Variable.
    // But if you want to sort or filter items, then you should use query parameter.

    for (const key in req.query) {
        console.log(key, req.query[key])
        console.log(req.params)
    }
    console.log(req.body);
    next();
});

matRouter.route('/').get(matController.getMatList);
matRouter.route('/:name').get(matController.getMat);
matRouter.route('/new').post(matController.addMat);
matRouter.route('/:name/edit').put(matController.editMat);
matRouter.route('/:name/delete').delete(matController.deleteMat);

module.exports = matRouter;
