/**
 * Created by Kasper Terp on 21-02-2017.
 */
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const moment = require('moment');
const io = require('socket.io').listen(server);
const message = require('./dist/Models/schema.server.model');
const chatRoom = require('./dist/Models/schema.chatrooms.model');
const users = [];
const connections = [];

server.listen(3000);

console.log('Server running...');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.get('/',function (req, res) {
        res.render('index');
    });

    //connect
io.sockets.on('connection', function(socket){
    connections.push(socket);
    let currentRoom = 'room 1';
    console.log('Connected: %s sockets connected', connections.length);
    socket.join(currentRoom);
    socket.emit('selectedRoom', currentRoom);
    // Disconnect
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    //Getting messages for current default room, before the socket
    message.find({room: currentRoom},function (err, messages) {
        if(err) return console.error(err);
        io.sockets.emit('get messages', messages);
    });

    socket.on('new user', function (data) {
            socket.username = data;
            console.log(socket.username);
            users.push(socket.username);
            io.sockets.emit('usernames', users);
            updateUsernames();
    });
    // Send message
    socket.on('send message', function(data){
        io.in(currentRoom).emit('new message', {message: data.message, user: data.user, created: data.created});
        // Create new message
        let newMsg = new message ({ user: data.user, message: data.message, room: currentRoom });

        // Insert to db
        newMsg.save(function (err, newMsg) {
            if (err) return console.error(err);
            console.log("message is saved");
        });

    });
    socket.on('create room',function(data) {
        socket.emit('new room',{room: data});
        const newRoom = new chatRoom({ room: data});
        newRoom.save(function (err, newRoom) {
            if (err) return console.error(err);
            console.log("room is saved :", newRoom);
        });
    });
    socket.on('selected room', function (data) {
        socket.leave(currentRoom);
        currentRoom = data;
        socket.join(data);
        socket.emit('selectedRoom', data);
        message.find({room: data},function (err, messages) {
            if(err) return console.error(err);
            socket.emit('get messages', messages);
        });
    });
    //get and emit chatrooms from mongo
    chatRoom.find(function (err, rooms) {
        if(err) return console.error(err);
        io.sockets.emit('get rooms', rooms);
    });

    // Update usernames
    function updateUsernames(){
            io.sockets.emit('get users', users);
    }



});

