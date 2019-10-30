let express = require('express')
var router = express.Router()

const { scholarshipController } = require('../controller')

router.post('/addScholarship', scholarshipController.postScholarship)
router.get('/getScholarshipPerUser', scholarshipController.getScholarshipPerUser )
router.get('/getScholarshipDetail', scholarshipController.getScholarshipDetail)
router.get('/getScholarship', scholarshipController.getAllScholarshipList)
router.put('/putScholarship', scholarshipController.putScholarship)
router.put('/cancelScholarship', scholarshipController.cancelScholarship)

module.exports = router;