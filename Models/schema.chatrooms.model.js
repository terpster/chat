/**
 * Created by Kasper Terp on 12-03-2017.
 */
const mongoose = require('mongoose');
const schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/chat');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("hello im connected");
});
let chatRoomSchema = schema({
    room : String
});

let chatRoom = mongoose.model('chatroom', chatRoomSchema);


module.exports = chatRoom;