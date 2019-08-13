const express = require('express');
const analyzerRouter = express.Router();
const analyzerController = require('./../../../controllers/analyzerController');

analyzerRouter.use('/', (req, res, next)=>{
    console.log("analyzer router start");
    console.log('time: ', Date());
    //Request vs Params parameters
    //If you want to identify a resource, you should use Path Variable.
    // But if you want to sort or filter items, then you should use query parameter.

    for (const key in req.query) {
        console.log(key, req.query[key])
        console.log(req.params)
    }
    console.log('body:',req.body)
    next();
});

analyzerRouter.route('/').get(analyzerController.getAnalyzerList);
analyzerRouter.route('/:id').get(analyzerController.getAnalyzer);
analyzerRouter.route('/new').post(analyzerController.addAnalyzer);
analyzerRouter.route('/:id/update').put(analyzerController.updateAnalyzer);

module.exports = analyzerRouter;
