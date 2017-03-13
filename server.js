// /**
//  * Created by Kasper Terp on 21-02-2017.
//  */
// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io').listen(server);
// const mongoose = require('mongoose');
// const message = require('./dist/Models/schema.server.model');
//
// users = [];
// connections =[];
// app.use(express.static(__dirname + '/'));
// server.listen(process.env.PORT || 3000);
// console.log("server is running");
//
// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.ejs')
//
// });
//
// // //new user
// // socket.on('new user', function (data, callback) {
// //     callback(true);
// //     username = socket.username;
// // });
//
//
// io.sockets.on('connection', function (socket) {
//     connections.push(socket);
//     console.log('connected : %s socekts connected', + connections.length);
//     // discconnect
//     socket.on('disconnect', function (data) {
//         connections.splice(connections.indexOf(socket), 1);
//         console.log("disconnected: %s  sockets connected", + connections.length)
//     });
//     socket.on ('send message', function (data) {
//         io.sockets.emit('new message', {msg: data});
//         console.log(data);
//         let newMsg = new message({user: socket.user, message: data, room: socket.chatroom});
//         newMsg.save(function (err, newMsg) {
//             if(err) return console.log(err);
//             console.log("im saved fuckeheads");
//
//         });
//
//     });
// });




// const moment = require('moment'); //timestamps
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const message = require('./dist/Models/schema.server.model');
let chatRoom = require('./dist/Models/schema.chatrooms.model');
let currentRoom = 'room 1';
const users = [];
const connections = [];
const images = ["yuna", "kim", "james", "kasper", "jane", "mike", "lin", "karl", "julia", "jones", "helen", "chris"];

let messages= [];

server.listen(3000);
console.log('Server running...');

app.set('view engine', 'ejs');
// Allow static files to be used
app.use(express.static(__dirname + '/'));

app.get('/',function (req, res) {

    chatRoom.find(function (err, rooms) {
        if(err) return console.error(err);
        res.render('index',{chatRoom: rooms});
    });
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    socket.join(currentRoom);
    // Disconnect
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
//new user
    socket.on('new user', function (data, callback) {
        callback(true);
        username = socket.username;
    });
    // Send message
    socket.on('send message', function(data){
        io.in(currentRoom).emit('new message', {message: data.message, user: data.user, image: userImage});
                // Create new message
        let newMsg = new message ({ user: data.user, message: data.message, room: currentRoom });

        // Insert to db
        newMsg.save(function (err, newMsg) {
            if (err) return console.error(err);
            console.log("message is saved");
        });

    });
    socket.on('create room',function(data) {
        io.emit('new room',{room: data});
        const newRoom = new chatRoom({ room: data});
        newRoom.save(function (err, newRoom) {
            if (err) return console.error(err);
            console.log("room is saved");
        });
    });


    // New user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;

        const object = {
            username: socket.username,
            image: userImage
        };

        users.push(object);
        updateUsernames();
    });

    // Update usernames
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
    //get and emit messages from mongo
    message.find(function (err, messages) {
        if(err) return console.error(err);
        io.sockets.emit('get messages', messages);
    });
    //get and emit chatrooms from mongo
    chatRoom.find(function (err, rooms) {
        if(err) return console.error(err);
        io.sockets.emit('get rooms', rooms);
    });


    function selectRandomImage(){
        return images[Math.floor(Math.random()*images.length)];
    }
    let userImage = selectRandomImage(); // Select random image for the new user

});

