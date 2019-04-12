var express = require('express')
var controller = require('../controllers/analytics.server.controller')
var router = express.Router();

router.get('/', controller.showForm);
//router.post('/survey', controller.showResult);
module.exports = router;
