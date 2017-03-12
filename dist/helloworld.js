"use strict";

$(document).ready(function () {
    var user = void 0;
    var chatRooms = $('.chatRooms');
    var currentChatRoom = "Room 1";
    var messages = [];

    function getUsername() {
        user = prompt("Type in your username dawd :");
    }

    getUsername();

    // get msgs
    // function getMessages() {
    // io.sockets.emit('get messages', messages);
    // }


    // let chatWindow = $('#chatMsgs');
    $(function () {
        var socket = io.connect();
        var $messageForm = $('#messageForm');
        var $message = $('#inputMSg');
        var $chat = $('#chatMsgs');

        $messageForm.submit(function (e) {
            e.preventDefault();
            socket.emit('send message', $message.val());
            $message.val('');
            console.log("submitted");
        });
        socket.on('new message', function (data) {
            $chat.append('<li>' + data.msg + '</li>');
        });

        socket.on('get messages', function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                console.log(i);
                html += '<li>' + data[i].message + '</li>';
            }
            $chat.html(html);
        });
    });

    $('#inputBut').click(function () {
        var msg = $('#inputMSg').val();
        var object = {
            user: user,
            message: msg,
            chatroom: currentChatRoom
        };
        messages.push(object);
        // chatWindow.append("<li>"+object.user + " : " + object.message+"</li>");
        console.log(messages);
    });
});
//# sourceMappingURL=helloworld.js.map