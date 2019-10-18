var express = require('express')
var router = express.Router()

const { paymentController } = require('../controller')

router.get('/getPayment', paymentController.getPayment )
router.post('/getSnapMd', paymentController.getSnapMd)
router.post('/updatePayment', paymentController.updatePayment)
router.post('/getHistory', paymentController.getHistory)

router.post('/getSubscription', paymentController.getSubscription)
router.post('/applySubscription', paymentController.getSubscription);

module.exports = router;