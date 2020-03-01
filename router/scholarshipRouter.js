let express = require('express')
var router = express.Router()
var { auth } = require('../helpers/auth')

const { scholarshipController } = require('../controller')

router.get('/getScholarshipDetail', scholarshipController.getScholarshipDetail)


router.post('/getscholarship', scholarshipController.getAllScholarshipList) // Yang dipake di UI untuk fiter scholarship

router.post('/addScholarship', auth, scholarshipController.postScholarship)
router.post('/getScholarshipPerUser', auth, scholarshipController.getScholarshipPerUser)
// router.get('/getScholarship', scholarshipController.getScholarship)
router.put('/putScholarship', auth, scholarshipController.putScholarship)
router.put('/cancelScholarship', auth, scholarshipController.cancelScholarship)
router.get('/getExistStudent', auth, scholarshipController.getExistStudent)
router.put('/putVerification', auth, scholarshipController.putVerification)

router.post('/GenerateURL',scholarshipController.generateImgUrlquill)
// router.post('/getAllScholarship', scholarshipController.getAllScholarship)

router.post('/scholarshipdonations', scholarshipController.getScholarshipDonations)

router.post('/getAllProvinceStudent', scholarshipController.showAvailableProvince)

// admin
router.post('/getScholarshipAllUserByAdmin', auth, scholarshipController.getScholarshipAllUserByAdmin)
router.post('/getScholarshipDetailByAdmin', auth, scholarshipController.getScholarshipDetailByAdmin)
router.post('/verifikasiScholarship', auth, scholarshipController.verifikasiScholarship);

// User 
router.post('/getAvailableScholarship', auth, scholarshipController.getAvailableScholarship)

// getScholarshipDetailByAdmin

module.exports = router;