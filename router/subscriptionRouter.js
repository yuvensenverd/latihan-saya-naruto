var express = require('express')
var router = express.Router()

const { subscriptionController } = require('../controller')

router.post('/usersubscribe', subscriptionController.userSubscribe)
router.post('/cancelsubscription', subscriptionController.cancelSubscription)
router.get('/subscribelist/:id', subscriptionController.getUserSubscriptionList)




module.exports = router;