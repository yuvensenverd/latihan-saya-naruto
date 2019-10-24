var express = require('express')
var router = express.Router()

const { studentRevisionController } = require('../controller')


router.post('/poststudentrev', studentRevisionController.postStudentRevision)
router.post('/newstudentapprove/:id', studentRevisionController.newStudentApprove)
router.post('/newstudentreject/:id', studentRevisionController.newStudentReject)
router.get('/getstudentrev', studentRevisionController.adminGetStudent)


module.exports = router;