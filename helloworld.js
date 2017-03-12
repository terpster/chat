$(document).ready(function () {
    let user;
    let chatRooms = $('.chatRooms');
    let currentChatRoom = "Room 1";
    const messages = [];

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
        let socket = io.connect();
        let $messageForm = $('#messageForm');
        let $message = $('#inputMSg');
        let $chat = $('#chatMsgs');

        $messageForm.submit(function (e) {
            e.preventDefault();
            socket.emit('send message', $message.val());
            $message.val('');
            console.log("submitted");

        });
        socket.on('new message', function (data) {
            $chat.append('<li>' + data.msg + '</li>')

        });
        $('#createRoom').click(function () {
            let createRoom = prompt("Give your chatroom a name :");
            socket.emit('create room', createRoom)
        });
        socket.on('get messages', function (data) {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                console.log(i);
                html += '<li>' + data[i].message + '</li>'
            }
            $chat.html(html);
        });

        $('#inputBut').click(function () {
            let msg = $('#inputMSg').val();
            let object = {
                user: user,
                message: msg,
                chatroom: currentChatRoom
            };
            messages.push(object);
            // chatWindow.append("<li>"+object.user + " : " + object.message+"</li>");
            console.log(messages);
        });

    });
});