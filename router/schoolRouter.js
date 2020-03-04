var express = require('express')
var router = express.Router()
var {auth} = require('../helpers/auth')

const { schoolController} = require('../controller')


router.post('/addSchool', auth, schoolController.addSchool)
router.post('/putSchool', auth, schoolController.putSchool)
router.post('/verifiedSchool', auth, schoolController.verifiedSchool)
router.post('/deleteSchool', auth, schoolController.deleteSchool)
router.post('/getSelectedSchool', auth, schoolController.getSelectedSchool)
router.post('/getallschools', schoolController.getAllSchool)
router.post('/details/:id', schoolController.getSchoolDetails)

/* User */
router.post('/getSchool', auth, schoolController.getSchool)
router.post('/searchNPSN', schoolController.searchNPSN)
router.post('/searchSchoolName', schoolController.searchSchoolName)
router.post('/addSchoolByUser', auth, schoolController.addSchoolUser)
router.post('/getSchoolById', auth, schoolController.getSchoolById)

/* Admin */
router.post('/getAdminSchool', auth, schoolController.getAllSchoolByAdmin)

module.exports = router