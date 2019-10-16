var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var port = 1998

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public')) 
app.use(cors())
app.use(bodyParser.json())

const {userRouter, paymentRouter} = require('./router')
app.use("/user", userRouter)
app.use('/payment', paymentRouter)


app.listen(port, ()=> console.log(` Api aktif di port  ${port} `))