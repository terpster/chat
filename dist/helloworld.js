"use strict";

$(document).ready(function () {
    var user = void 0;
    var currentChatRoom = "Room 1";
    var chatWindowList = $('#messagesList');
    var messages = [{
        user: "terp",
        message: "suh dude",
        chatroom: "Room 1"
    }, {
        user: "Steve",
        message: "S A U C E",
        chatroom: "Room 1"
    }];
    var object = {
        user: "chrion",
        message: "FUCKIN STEVE",
        chatroom: "Room 2"
    };
    messages.push(object);

    function getUsername() {
        user = prompt("Type in your username dawd :");
    }

    getUsername();
    // function getRoomMessages() {
    //     let chatRoomMessages = "";
    //
    //     for(let i=0; i<messages.length; i++){
    //         if(messages[i].chatroom == currentChatRoom){
    //             chatRoomMessages+="<li>"+messages[i].user+" : "+messages[i].message+"</li>";
    //         }
    //     }
    //     let msgList = chatRoomMessages;
    //     chatWindow.append(msgList);
    // }

    var chatWindow = $('#chatMsgs');
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