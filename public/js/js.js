const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
let privateName = "";
let privateUser = "";
let private = false;
// const images = document.getElementsByClassName('fa');
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
const socket = io();
// Join chatroom
socket.emit('joinRoom', { username });
// Get room and users
socket.on('roomUsers', ({ users }) => {
    // outputRoomName(room);
    outputUsers(users);
});
// Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('joined', (data) => {
    console.log(data);
joined(data);
});
// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get message text
    let msg = e.target.elements.msg.value;

     if (private) {
        socket.emit("private", {
            private: privateName,
            user: username,
            msg: msg,
            to: privateUser,
            from: username
        });
    } else {
        socket.emit('chatMessage', msg);
    }
    $(".message").val("");
    $(".message").focus();

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});
// Output message to DOM


socket.on("private", function (data) {
    console.log(data.msg);
    console.log(data.private);
    console.log(data.user);
    console.log(data.time);
var users = data.user;
        if (users == username) {
            $('#privateRoom').append(`<p class="outputM1">${data.msg}<small class='outputM text-primary' ><br>${data.user}</small>&nbsp;<small class='text-muted'>${data.time}</small></p>`);
        } else {
            $('#privateRoom').append(`<p>${data.msg}<small class='type text-primary'><br>${data.user}&nbsp;<span class='text-muted'>${data.time}</span></small></p>`);
        }
    privateRoom.scrollTop = privateRoom.scrollHeight;
});



function joined(data){
    $('.message').append(`<p  class='welcomeMessage'>${data.text}<small><br>${data.username}</small>&nbsp;<small class='text-muted'>${data.time}</small></p`);
}

function outputMessage(message) {
// let username1;
//     username1 = message.username;
    var users = message.username;
    if(users == username) {
        $('.message').append(`<p class="outputM1">${message.text}<small class='outputM text-primary' ><br>${message.username}</small>&nbsp;<small class='text-muted'>${message.time}</small></p>`)
 } 
else {
        $('.message').append(`<p>${message.text}<small class='type text-primary'><br>${message.username}&nbsp;<span class='text-muted'>${message.time}</span></small></p>`)
    }
}
// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {

    if(user.username == username){ 
     $('#users').append(`<li><small>You</small>(${user.username})</li>`);
}else{
     $('#users').append(`<li class="private-user" user-name="${user.username}" user-id="${user.id}" ><a class="otherUsers">${user.username}</a></li>`);
}

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

$("#users").on("click", ".private-user", function () {
    privateName = $(this).attr("user-name");
    privateUser = $(this).attr("user-id");
    console.log(privateUser);

    private = true;
    showPrivateCard()
    // console.log(private);
    $(".room-username").html($(this).attr("user-name"));

});


function showPrivateCard() {
    var x = document.getElementById("private-card");
    if (x.style.display === "none") {
        x.style.display = "block";
        $('.privateRoom').empty();
        private = true;
        // $('#typingMes').detach('');
        // $('.typo').detach('');

    } else {
        x.style.display = "none";
        $('.privateRoom').empty();
        private = false;
        // $('.roomPri').prepend(hidetype);
        // $('.roomPri').prepend(hidetype1);
    }
}

   