'use strict';

/**
 * Created by Kasper Terp on 07-03-2017.
 */
var mongoose = require('mongoose');
var schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/chat');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("hello im connected");
});
var chatSchema = schema({
    user: String,
    message: String,
    room: String,
    createdOn: { type: Date, default: Date.now }

});

var message = mongoose.model('message', chatSchema);

module.exports = message;
//# sourceMappingURL=schema.server.model.js.map