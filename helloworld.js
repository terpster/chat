$(document).ready(function () {
    let user;
    let currentChatRoom = "Room 1";
    let chatWindowList = $('#messagesList');
    const messages = [
        {
            user: "terp",
            message: "suh dude",
            chatroom: "Room 1"
        },
        {
            user: "Steve",
            message: "S A U C E",
            chatroom: "Room 1"
        }
    ];
    const object = {
        user: "chrion",
        message: "FUCKIN STEVE",
        chatroom: "Room 2"
    };
    messages.push(
        object
    );


    function getUsername () {
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

    let chatWindow = $('#chatMsgs');
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
            $chat.append('<li>'+data.msg+'</li>')
            
        })
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
    })

});