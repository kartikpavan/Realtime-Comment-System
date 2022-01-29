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
        <h4>${data.username}</h4>
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

let timerId = null
function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId)
  }
  timerId = setTimeout(() => {
    func()
  }, timer)
}
let typingDiv = document.querySelector('.typing')
socket.on('typing', (data) => {
  typingDiv.innerText = `${data.username} is typing`
  debounce(function () {       //once typing event stops , means user stopped typing
    typingDiv.innerText = '' //then after 1 second    run this line 
  }, 1000)
})
//event listener on text area 
textarea.addEventListener('keyup', (e) => {
  socket.emit('typing', { username })
})
//debounce article
// https://www.educative.io/edpresso/how-to-use-the-debounce-function-in-javascript?aid=5082902844932096&utm_source=google&utm_medium=cpc&utm_campaign=edpresso-dynamic&gclid=CjwKCAjwqpP2BRBTEiwAfpiD-wQYCgiTiiXkrkuaiU5FqBnVYqGnqhKetIUbJU_pba9SgV_7aTrObhoCo38QAvD_BwE