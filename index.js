var express = require('express')
const bearerToken = require('express-bearer-token');
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var port = 1998

const http = require('http').createServer(app)

const io = require('socket.io')(http, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
})





app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public')) 
app.use(cors())
app.use(bodyParser.json())
app.use(bearerToken())

app.io = io
console.log('masuk io')
io.on('connection', (socket) => {
    console.log('User connected')
    io.emit('user connected', {})
    socket.on('disconnect', () => {
            console.log('user disconnected')
            io.emit('user connected', {})
    })
})

const {userRouter, paymentRouter,studentRouter,studentDetailRouter,projectRouter} = require('./router')
app.use("/user", userRouter)
app.use('/payment', paymentRouter)
app.use("/user", userRouter)
app.use('/student',studentRouter)
app.use("/project", projectRouter)
app.use("/studentdetail", studentDetailRouter)
app.get('/', (req, res) => {
    res.status(200).send(
        `<h3>Welcome to Kasih Nusantara API</h3>`
    )
})


app.listen(port, ()=> console.log(` Api aktif di port  ${port} `))