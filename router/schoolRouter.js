var express = require('express')
var router = express.Router()
var {auth} = require('../helpers/auth')

const { schoolController} = require('../controller')

router.get('/getSchool', schoolController.getSchool)
router.post('/addSchool', auth, schoolController.addSchool)
router.post('/putSchool', auth, schoolController.putSchool)
router.post('/verifiedSchool', auth, schoolController.verifiedSchool)
router.post('/deleteSchool', auth, schoolController.deleteSchool)

module.exports = router