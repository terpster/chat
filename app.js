
$(document).ready(function () {
    let $user;
    let socket = io.connect();
    function getUsername() {
        $user = prompt("Type in your username:");
        socket.emit('new user', $user);
    }
    getUsername();
    // let chatWindow = $('#chatMsgs');
    $(function () {
        let $messageForm = $('#messageForm');
        let $message = $('#inputMSg');
        let $chat = $('#chatMsgs');
        let $rooms = $('#rooms');
        let $users = $('#users');

        $messageForm.submit(function (e) {
            let $date = moment();
            console.log($date);
            let $formattedDate = moment($date).format('H:mm - DD-MM-YYYY');
            e.preventDefault();
            socket.emit('send message', { message: $message.val(), user: $user, created: $formattedDate} );
            $message.val('');
            console.log("submitted");
        });

        socket.on('new message', function (data) {
            $chat.append('<li>'  + '<strong style="color: #207f3c">'+data.user +'</strong>'+ " : "+ data.message+" " +'<div style="display:inline; color: rgba(255,255,255,0.20); font-size: x-small;">'+ data.created +'</div>'+'</li>')
        });
        socket.on('get messages', function (data) {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                html += '<li>' + '<strong style="color: #207f3c">'+data[i].user + '</strong>'+" : " +data[i].message+" "+'<div style="display:inline; color: rgba(255,255,255,0.20); font-size: x-small;">'+ moment(data[i].createdOn).format('H:mm - DD-MM-YYYY')+'</div>'+'</li>'
            }
            $chat.html(html);
        });
        socket.on('get users', function (data) {
            console.log(data);
            let html = '';
            for(let i =0; i<data.length; i++){
                html+='<li>'+data[i] +'</li>'
            }
            $users.html(html);
        });
        //Rooms
        //create room and emit
        $('#createRoom').click(function () {
            let createRoom = prompt("Give your chatroom a name :");
            socket.emit('create room', createRoom)
        });

        $('#rooms').on('click', 'li>',  function () {
            let selectedRoom = $(this).text();
            console.log(selectedRoom);
                socket.emit('selected room', selectedRoom);
        });

        //append the latest room to html (add room to end of list)
        socket.on('new room', function (data) {
            $rooms.append('<li class="selectRoom"><a href="#" >' + data.room + '</a></li>')
            
        });
        //get rooms from db and show them in the list
        socket.on('get rooms', function (data) {
            console.log(data);
            let html = '';
            for(let i= 0; i<data.length; i++){
                html+='<li class="selectRoom"><a href="#" >' + data[i].room + '</a></li>'
            }
            $rooms.html(html);
        });
    });
});