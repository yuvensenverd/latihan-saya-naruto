let express = require('express')
var router = express.Router()
var { auth } = require('../helpers/auth')

const { scholarshipController } = require('../controller')

router.get('/getScholarshipDetail', scholarshipController.getScholarshipDetail)
router.post('/getscholarship', scholarshipController.getAllScholarshipList)

router.post('/addScholarship', auth, scholarshipController.postScholarship)
router.post('/getScholarshipPerUser', auth, scholarshipController.getScholarshipPerUser)
// router.get('/getScholarship', scholarshipController.getScholarship)
router.put('/putScholarship', auth, scholarshipController.putScholarship)
router.put('/cancelScholarship', auth, scholarshipController.cancelScholarship)
router.get('/getExistStudent', auth, scholarshipController.getExistStudent)
router.put('/putVerification', auth, scholarshipController.putVerification)

router.post('/GenerateURL',scholarshipController.generateImgUrlquill)
// router.post('/getAllScholarship', scholarshipController.getAllScholarship)
router.post('/getScholarshipAllUserByAdmin', auth, scholarshipController.getScholarshipAllUserByAdmin)
router.post('/scholarshipdonations', scholarshipController.getScholarshipDonations)

router.post('/getAllProvinceStudent', scholarshipController.showAvailableProvince)

// User 
router.post('/getAvailableScholarship', auth, scholarshipController.getAvailableScholarship)

module.exports = router;