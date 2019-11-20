var express = require('express')
var router = express.Router()
var {auth} = require('../helpers/auth')

const { schoolController} = require('../controller')

router.post('/getSchool', schoolController.getSchool)
router.post('/getSchoolAdmin', auth, schoolController.getSchoolAdmin)
router.post('/addSchool', auth, schoolController.addSchool)
router.post('/putSchool', auth, schoolController.putSchool)
router.post('/verifiedSchool', auth, schoolController.verifiedSchool)
router.post('/deleteSchool', auth, schoolController.deleteSchool)
router.post('/getSelectedSchool', auth, schoolController.getSelectedSchool)

module.exports = router