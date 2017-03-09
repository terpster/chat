'use strict';

/**
 * Created by Kasper Terp on 21-02-2017.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');

users = [];
connections = [];
app.use(express.static(__dirname + '/'));
server.listen(process.env.PORT || 3000);
console.log("server is running");

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('connected : %s socekts connected', +connections.length);
    // discconnect
    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log("disconnected: %s  sockets connected", +connections.length);
    });
    socket.on('send message', function (data) {
        io.sockets.emit('new message', { msg: data });
        console.log(data);
    });
});
//# sourceMappingURL=server.js.map