let express = require('express')
var router = express.Router()

const { scholarshipController } = require('../controller')

router.post('/addScholarship', scholarshipController.postScholarship)
router.get('/getScholarshipPerUser', scholarshipController.getScholarshipPerUser )

module.exports = router;