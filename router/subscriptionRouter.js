var express = require('express')
var router = express.Router()

const { subscriptionController } = require('../controller')

router.post('/usersubscribe', subscriptionController.userSubscribe)
router.get('/subscribelist/:id', subscriptionController.getUserSubscriptionList)
router.post('/cancelsubscription',subscriptionController.cancelSubscription)
router.post('/subscriptionpay',subscriptionController.subscriptionPayment)
router.post('/getnominal/:id',subscriptionController.getUserSubscriptionNominal)

module.exports = router;