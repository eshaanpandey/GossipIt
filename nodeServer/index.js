// Node server which will handle socket io connection

// const { socket } = require('socket.io');
const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket =>{
    // it is a socket.io instance server
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        // ek particular instance agar on hua to kya hona chaiye
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})