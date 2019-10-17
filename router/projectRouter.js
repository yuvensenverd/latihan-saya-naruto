var express = require('express')
var router = express.Router()

const { projectController } = require('../controller/index')

router.post('/postproject', projectController.postProject)
router.get('/getproject', projectController.getProject)
router.put('/editproject/:id', projectController.editProject)
router.put('/deleteproject/:id', projectController.deleteProject)



module.exports = router