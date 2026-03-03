const express = require("express");
const app = express()

app.use(express.static("public"))

const expressServer = app.listen(4000)

const socketIo = require('socket.io')

const io = socketIo(expressServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log(socket.id, 'has joined our server!')

    socket.emit('welcome', [1, 2, 3])
    io.emit('newClient', socket.id)

    socket.on('message', (data) => {
        console.log('message from client', data)
        // Send as object so client knows who's who
        io.emit('message', {
            text: data,
            senderId: socket.id
        })
    })
})