const express = require('express')
const http = require('http')
const port = 1998

const bodyParser = require('body-parser')
const cors = require('cors')

const bearerToken = require('express-bearer-token');

require('./scheduler/schedulers')
const app = express()
const socketIO = require('socket.io').listen(app.listen(port))

app.use(bodyParser.json())
app.use(cors())

// const server = http.createServer(app)
const io = socketIO(server)



app.io = io



app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public')) 


app.use(bearerToken())

//socketio




const {userRouter, paymentRouter,studentRouter,studentDetailRouter,projectRouter,testRouter} = require('./router')
app.use("/user", userRouter)
app.use('/payment', paymentRouter)
app.use("/user", userRouter)
app.use('/student',studentRouter)
app.use("/project", projectRouter)
app.use("/studentdetail", studentDetailRouter)
app.use('/test',testRouter)


console.log('masuk io')
io.on('connection', (socket) => {
        console.log('User connected')
        io.emit('user connected', {})
        socket.on('disconnect', () => {
                console.log('user disconnected')
                io.emit('user connected', {})
        })
})



app.get('/', (req, res) => {
    res.status(200).send(
        `<h3>Welcome to Kasih Nusantara API</h3>`
    )
})




app.listen(port, ()=> console.log(` Api aktif di port  ${port} `))