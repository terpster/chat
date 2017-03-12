/**
 * Created by Kasper Terp on 12-03-2017.
 */
const mongoose = require('mongoose');
const schema = mongoose.Schema;

let chatRoomSchema = schema({
    room : String
});

let chatRoom = mongoose.model('chatroom', chatRoomSchema);


module.exports = chatRoom;