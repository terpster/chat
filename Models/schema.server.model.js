/**
 * Created by Kasper Terp on 07-03-2017.
 */
const mongoose = require('mongoose');
const schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/chat');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("hello im connected");
});
let chatSchema = schema({
    user : String,
    message : String,
    room : String,
    createdOn : {type : Date, default: Date.now}

});

let message = mongoose.model('message', chatSchema);

module.exports = message;
