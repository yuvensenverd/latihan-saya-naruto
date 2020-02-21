let express = require('express')
var router = express.Router()
const { auth } = require('../helpers/auth')

const { testimonialController } = require('../controller');

router.post('/postTestimonialMurid', auth, testimonialController.postTestimonial)


module.exports = router;