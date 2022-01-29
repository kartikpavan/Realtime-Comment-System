const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Comment = require('./models/comments')

mongoose
  .connect("mongodb://localhost:27017/comments")
  .then(() => {
    console.log("MongoDb Connection Established");
  })
  .catch((err) => {
    console.log("oh uh !! something went wrong");
    console.log(err);
  });

app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  const comments = await Comment.find({})
  res.render('home', { comments })
})

app.post('/api/comments', async (req, res) => {
  const { username, comment } = req.body
  const comments = await new Comment({ username, comment })
  await comments.save()
  console.log(comments)
})

const port = process.env.PORT || 3000;
const server = app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}`)
})

let io = require('socket.io')(server)

io.on('connection', (socket) => {
  //recieve event 
  socket.on('comment', (data) => {//first parameter is event name and second param 
    //is the data recieved from client 
    data.time = Date()
    socket.broadcast.emit('comment', data)
  })
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data)
  })
})

