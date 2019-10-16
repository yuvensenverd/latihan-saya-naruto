const { Sequelize, sequelize, Payment } = require('../models')
const midtransClient                    = require('midtrans-client')
const moment                            = require('moment')

const snap = new midtransClient.Snap({
    isProduction    : false,
    serverKey       : 'SB-Mid-server-Dr8HK_lJ4cuEZi4rUgNcsDUR',
    clientKey       : 'SB-Mid-client-Ttge99xVU4AOz44T'
})

module.exports = {
    //====================// midtrans //====================
    getSnapMd : (req, res) => {
        var { gross_amount, order_id} = req.body.parameter.transaction_details
        let { parameter } = req.body
        console.log('masuk get token midtrans')
        console.log(req.body)
        console.log('gros amount' + typeof(gross_amount))
        console.log(order_id)
        var Date = moment().format("YYMMDD")
        var randInt = Math.floor(Math.random()*(999-100+1)+100)
  
        snap.createTransaction(parameter)
        .then((transaction)=>{
            transactionToken = transaction.token;
            console.log('transactionToken: ', transactionToken)
            Payment.create({
                paymentType: '-',
                nominal: gross_amount,
                statusPayment: '-',
                projectId: req.body.userData.projectId,
                userId: req.body.userData.userId,
                isRefund: '0',
                isDeleted: '0',
                createAt: Date,
                updateAt : Date,
                order_id: order_id
            }).then(()=>{
                Payment.findAll()
                .then((result)=>{
                    console.log(result)
                    res.send(result)
                })
            }).catch((err)=>{
                console.log(err)
            })
            return res.status(200).send({transactionToken, order_id: parameter.transaction_details.order_id})
        })       
    },

    getStatus:(req,res)=>{
        
        const {order_id} = req.body
        console.log('========masuk getStatus =============')
        console.log(order_id)

        snap.transaction.status(order_id)
        .then((Response)=>{
            console.log('=======masuk status=========')
            console.log(Response)
            req.app.io.emit('status_transaction', Response.transaction_status)
            console.log(Response)
            mockNotificationJson = Response     
            snap.transaction.notification(Response)
                .then((statusResponse)=>{
                    console.log('=======masuk notification=========')
                    console.log(statusResponse)

                    let orderId = statusResponse.order_id
                    let transactionStatus = statusResponse.transaction_status
                    let fraudStatus = statusResponse.fraud_status

                    let msg = `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`

                    if(transactionStatus == 'settlement'){
                        console.log(transactionStatus)
                        if(fraudStatus == 'challenge'){
                            console.log(fraudStatus)
                            return res.status(200).send(msg)
                        }else if(fraudStatus == 'accept'){
                            console.log(fraudStatus)
                            return res.status(200).send(msg)
                        }
                    }else if(transactionStatus == 'cancel' || transactionStatus == 'failure'){
                        console.log(transactionStatus)
                        return res.status(200).send(msg)
                    }else if(transactionStatus == 'pending'){
                        console.log(transactionStatus)
                        return res.status(200).send(msg)
                    }
                })      
            })
    },


    //====================// end of midtrans //====================

    getPayment : (req, res)=>{
        console.log('payment')
        res.send('payment')
        Payment.findAll()
        .then((result)=>{
            console.log(Payment)
            console.log(result)
            res.status(200).send(result)
        })
        .catch((err)=>{
            console.log(err)
        })
    },
    

}