var express = require('express')
var controller = require('../controllers/analytics.server.controller')
var router = express.Router();

router.get('/', controller.showForm);

//change back to this later
router.post('/main', controller.showMain);
router.get('/main', controller.showMain);
router.get('/main/getHighLowRev', controller.getHighLowRev);
router.get('/main/article', controller.showIndividualResult);
router.get('/main/article/getBar', controller.getIndividualBarChartTop5);
//router.get('/main/getResult', controller.showResult);
module.exports = router;
