$(document).ready(function () {
    let $user;
    let chatRooms = $('.chatRooms');

    function getUsername() {
        $user = prompt("Type in your username dawd :");
        console.log($user);
    }
    getUsername();
    // let chatWindow = $('#chatMsgs');
    $(function () {
        let socket = io.connect();
        let $messageForm = $('#messageForm');
        let $message = $('#inputMSg');
        let $chat = $('#chatMsgs');
        let $rooms = $('#rooms');

        $messageForm.submit(function (e) {
            e.preventDefault();
            socket.emit('send message', { message: $message.val(), user: $user} );
            $message.val('');
            console.log("submitted");

        });
        socket.on('new message', function (data) {
            $chat.append('<li>'  + data.user + ": "+ data.message + '</li>')
        });
        socket.on('get messages', function (data) {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                console.log(i);
                html += '<li>' + data[i].user + ": " +data[i].message + '</li>'
            }
            $chat.html(html);
        });


        //Rooms
        //create room and emit
        $('#createRoom').click(function () {
            let createRoom = prompt("Give your chatroom a name :");
            socket.emit('create room', createRoom)
        });

        //append the latest room to html (add room to end of list)
        socket.on('new room', function (data) {
            $rooms.append('<li id="selectRoom"><a href="#" >' + data.room + '</a></li>')
            
        });
        //get rooms from db and show them in the list
        socket.on('get rooms', function (data) {
            let html = '';
            for(let i= 0; i<data.length; i++){
                console.log("rooms : ", i.room);
                html+='<li id="selectRoom"><a href="#" >' + data[i].room + '</a></li>'
            }
            $rooms.html(html);
        });
        $('#selectRoom').click(function () {
            
            
        })

    });
});