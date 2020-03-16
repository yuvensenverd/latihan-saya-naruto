var express = require('express')
var router = express.Router()

const { pencairandanaController } = require('../controller')
const { auth } = require('../helpers/auth')

router.post('/request', pencairandanaController.cair)
router.post('/approve', pencairandanaController.approve)
router.post('/getselected', pencairandanaController.getSelectedPencairan)
router.post('/cekspp', pencairandanaController.checkspp)
router.post('/getall', pencairandanaController.getPencairan)
router.get('/lastid', pencairandanaController.getlastid)
 
module.exports = router;