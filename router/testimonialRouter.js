let express = require('express')
var router = express.Router()
const { auth } = require('../helpers/auth')

const { testimonialController } = require('../controller');

router.post('/guestGetTestimonialStudent', testimonialController.guestGetTestimonialStudent)
router.get('/getAllTestimonialStudentForGuest', testimonialController.getAllTestimonialGuest)
router.post('/getTestimoniStudent', auth, testimonialController.getTestimonial)
router.post('/postTestimonialMurid', auth, testimonialController.postTestimonial)


module.exports = router;