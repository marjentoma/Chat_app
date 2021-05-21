const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users.js');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'ChatPlus';
// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // Welcome current user
        socket.emit('joined', formatMessage(botName, 'Welcome to ChatPlus!'));
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('joined', formatMessage(botName, `${user.username} has joined the chat`));
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

  const moment = require('moment');
  socket.on("private", function (data) {
    io.to(data.to).emit('private', { from: socket.id, to: data.to, msg: data.msg, private: data.private, user: data.user, time: moment().format('h:mm a')  });
    // io.sockets.sockets[data.to].emit("private", { from: socket.id, to: data.to, msg: data.msg, private: data.private, user: data.user, time: moment().format('h:mm a') });
    // socket.emit("private", { from: socket.id, to: data.to, msg: data.msg, private: data.private, user: data.user, time: moment().format('h:mm a') });
  });




    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('joined', formatMessage(botName, `${user.username} has left the chat`));
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

   // typing
    socket.on("typing",(data) => {
     socket.broadcast.emit("typing",data)
    });
socket.on("stop-typing",(data) => {
     socket.broadcast.emit("typing",data)
    });



});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));