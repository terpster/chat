'use strict';

$(document).ready(function () {
    var $user = void 0;
    var chatRooms = $('.chatRooms');
    var socket = io.connect();
    function getUsername() {
        $user = prompt("Type in your username dawd :");
        console.log($user);
    }
    getUsername();
    // let chatWindow = $('#chatMsgs');
    $(function () {

        var $messageForm = $('#messageForm');
        var $message = $('#inputMSg');
        var $chat = $('#chatMsgs');
        var $rooms = $('#rooms');

        $messageForm.submit(function (e) {
            e.preventDefault();
            socket.emit('send message', { message: $message.val(), user: $user });
            $message.val('');
            console.log("submitted");
        });
        socket.on('new message', function (data) {
            $chat.append('<li>' + data.user + ": " + data.message + '</li>');
        });
        socket.on('get messages', function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                console.log(i);
                html += '<li>' + data[i].user + ": " + data[i].message + '</li>';
            }
            $chat.html(html);
        });

        //Rooms
        //create room and emit
        $('#createRoom').click(function () {
            var createRoom = prompt("Give your chatroom a name :");
            socket.emit('create room', createRoom);
        });
        $('#rooms').on('click', 'li>', function () {
            var selectedRoom = $(this).text();
            console.log(selectedRoom);
            socket.emit('selected room', selectedRoom);
        });

        //append the latest room to html (add room to end of list)
        socket.on('new room', function (data) {
            $rooms.append('<li class="selectRoom"><a href="#" >' + data.room + '</a></li>');
        });
        //get rooms from db and show them in the list
        socket.on('get rooms', function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                console.log("rooms : ", data[i].room);
                html += '<li class="selectRoom"><a href="#" >' + data[i].room + '</a></li>';
            }
            $rooms.html(html);
        });
    });
});
//# sourceMappingURL=helloworld.js.map