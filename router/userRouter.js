var express = require('express')
var router = express.Router()

const { userController } = require('../controller')

router.get('/login', userController.getUserData)
router.post('/register', userController.postUser)

module.exports = router