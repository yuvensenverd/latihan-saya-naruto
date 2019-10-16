var express = require('express')
const bearerToken = require('express-bearer-token');
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var port = 1998

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public')) 
app.use(cors())
app.use(bodyParser.json())
app.use(bearerToken())

app.get('/', (req, res) => {
    res.status(200).send(
        `<h3>Welcome to Kasih Nusantara API</h3>`
    )
})

const {userRouter} = require('./router')
app.use("/user", userRouter)


app.listen(port, ()=> console.log(` Api aktif di port  ${port} `))