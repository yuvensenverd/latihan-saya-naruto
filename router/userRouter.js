var express = require('express')
var router = express.Router()

const { userController} = require('../controller')

router.post('/register', userController.registerUser)

module.exports = router