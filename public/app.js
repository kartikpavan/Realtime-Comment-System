let socket = io()
let username
do {
  username = prompt("Enter your name: ")
} while (!username)

const textarea = document.getElementById('textarea')
const submit = document.getElementById('submit')
const comment_box = document.querySelector('.comment-box')

submit.addEventListener('click', (e) => {
  e.preventDefault()
  let comment = textarea.value
  if (!comment) {
    return
  }
  postComment(comment)
})

function postComment(comment) {
  //append 
  let data = {
    username: username,
    comment: comment
  }
  appendtoDom(data)
  textarea.value = ''
  //boradcast
  boradcastComment(data)
  //store in MongoDb
}

function appendtoDom(data) {
  let list = document.createElement('li')
  list.classList.add('comment', 'mb-3')
  let markup =
    `<div class="card border-light mb-3 rounded">
      <div class="card-body">
        <h6>${data.username}</h6>
        <p>${data.comment}</p>
        <div>
          <img src="/clock.png" height="20" alt="">
            <small>${moment(data.time).format('LT')}</small>
        </div>
      </div>
    </div>`
  list.innerHTML = markup
  comment_box.prepend(list)
}

function boradcastComment(data) {
  socket.emit('comment', data) //first param is event name and second param is data to be passed to server
}
socket.on('comment', (data) => {
  appendtoDom(data)
})