var express = require('express')
var router = express.Router()
var { auth } = require('../helpers/auth')
const{stundentController}=require('../controller')

router.get('/getstudentdata',stundentController.getStudentdata)
router.post('/poststudentdata', auth, stundentController.postStudentdata)
router.post('/getstudentdatapaging', stundentController.getStudentdatapaging)
router.put('/putstudentdata/:id', auth, stundentController.putStudentdata)
router.delete('/deletestudentdata/:id', auth, stundentController.deleteStudentdata)
router.get('/getstudentperuser', auth, stundentController.getStudentPerUser)



module.exports=router