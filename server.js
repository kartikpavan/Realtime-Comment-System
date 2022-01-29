const express = require('express')
const app = express()
const path = require('path')

app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('home')
})

const port = process.env.PORT || 3000;
const server = app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}`)
})

let io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log(`New connection ${socket.id}`)
  //recieve event 
  socket.on('comment', (data) => {//first parameter is event name and second param 
    //is the data recieved from client 
    data.time = Date()
    socket.broadcast.emit('comment', data)
  })
})

