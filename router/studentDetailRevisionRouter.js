

var express = require('express')
var router = express.Router();
var { auth } = require('../helpers/auth')

const { studentDetailRevisionController } = require('../controller');

router.get('/student-detail-unverified', auth, studentDetailRevisionController.getStudentUnverified);

module.exports = router