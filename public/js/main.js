const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
const socket = io();
// Join chatroom
socket.emit('joinRoom', { username, room });
// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});
// Message from server
socket.on('message', (message) => {
    // console.log(message);
    outputMessage(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get message text
    let msg = e.target.elements.msg.value;
    msg = msg.trim();
    if(!msg) {
        return false;
    }
    // Emit message to server
    socket.emit('chatMessage', msg);
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});
// Output message to DOM

function outputMessage(message) {
let username ;
    username = message.username;
    var users = message.username;
    if(users == username) {
        $('.message').append(`<div class="sendM"><p class="outputM1">${message.text}</p><small class='outputM '>${message.username}</small>&nbsp;<small class='text-muted'>${message.time}</small></p></div>`)
    } else {
        $('.message').append(`<div class="receiveM"><p class="text1">${message.text}</p> <small class='type'>${message.username}&nbsp;<span class='text-muted'>${message.time}</span></small></div> `)
    }
    // const div = document.createElement('div');
    // div.classList.add('message');
    // const p = document.createElement('p');
    // p.classList.add('meta');
    // p.innerText = message.username;
    // p.innerHTML += `<span>${message.time}</span>`;
    // div.appendChild(p);
    // const para = document.createElement('p');
    // para.classList.add('text');
    // para.innerText = message.text;
    // div.appendChild(para);
    // document.querySelector('.chat-messages').appendChild(div);
}
// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}
//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if(leaveRoom) {
        window.location = '../index.html';
    } 
});
// var timeout;
// var typing = false

// function timeoutFunction() {
//     typing = false;
//     socket.emit("typing", false);
// }
$('#msg').keyup(function() {
   var inputField = $('#msg')
     socket.emit("typing",{
        typing:inputField.val().length>0,
        username:username
    })
   
    
});
   socket.on("typing", (data)=>{
     $('.typing').html(data.typing?`${data.username} is typing..`:'')
})
$('.btn').on('click',function(){
var inputField = $('#msg')
    socket.emit('stop-typing',{
    typing: inputField.val().length==0,
    username : username
})
})
socket.on("stop-typing", (data)=>{
    $('.typing').html("")
    
})

   