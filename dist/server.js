'use strict';

/**
 * Created by Kasper Terp on 21-02-2017.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var moment = require('moment');
var io = require('socket.io').listen(server);
var message = require('./dist/Models/schema.server.model');
var chatRoom = require('./dist/Models/schema.chatrooms.model');
var users = [];
var connections = [];

server.listen(3000);
console.log('Server is running');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));
app.get('/', function (req, res) {
    res.render('index');
});

//Connect
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    var currentRoom = 'room 1';
    console.log('Connected: %s sockets connected', connections.length);
    socket.join(currentRoom);
    socket.emit('selectedRoom', currentRoom);
    //Disconnect
    socket.on('disconnect', function (data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    //Getting messages for current default room, before the socket
    message.find({ room: currentRoom }, function (err, messages) {
        if (err) return console.error(err);
        io.sockets.emit('get messages', messages);
    });
    //Get the username from frontend, push it to the users array, and updateUsernames accordinly
    socket.on('new user', function (data) {
        socket.username = data;
        users.push(socket.username);
        io.sockets.emit('usernames', users);
        updateUsernames();
    });
    //Recieve the text/message and send the message to the currently selected room
    socket.on('send message', function (data) {
        io.in(currentRoom).emit('new message', { message: data.message, user: data.user, created: data.created });
        // Create new message object
        var newMsg = new message({ user: data.user, message: data.message, room: currentRoom });

        //Insert the message object into the DB using the schema
        newMsg.save(function (err, newMsg) {
            if (err) return console.error(err);
            console.log("the message is saved!");
        });
    });
    //When a new room is created, the room is saved into the DB using the schema
    socket.on('create room', function (data) {
        socket.emit('new room', { room: data });
        var newRoom = new chatRoom({ room: data });
        newRoom.save(function (err, newRoom) {
            if (err) return console.error(err);
            console.log("room is saved :", newRoom);
        });
    });
    //When a room is selected that room is then assigned as the currentRoom, and the socket is joined on that
    socket.on('selected room', function (data) {
        socket.leave(currentRoom);
        currentRoom = data;
        socket.join(data);
        socket.emit('selectedRoom', data);
        message.find({ room: data }, function (err, messages) {
            if (err) return console.error(err);
            socket.emit('get messages', messages);
        });
    });
    //get and emit chatrooms from mongo
    chatRoom.find(function (err, rooms) {
        if (err) return console.error(err);
        io.sockets.emit('get rooms', rooms);
    });

    //Update usernames, emits the users array
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});
//# sourceMappingURL=server.js.map