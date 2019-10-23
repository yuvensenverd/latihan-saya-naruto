var express = require('express')
var router = express.Router()

const{stundentController}=require('../controller')

router.post('/poststudentdata',stundentController.postStudentdata)
router.get('/getstudentdata',stundentController.getStudentdata)
router.post('/getstudentdatapaging',stundentController.getStudentdatapaging)
router.put('/putstudentdata/:id',stundentController.putStudentdata)
router.delete('/deletestudentdata/:id',stundentController.deleteStudentdata)


module.exports=router