var socket_io = require('socket.io');
var io = socket_io();
var socketAPI = {};

socketAPI.io = io;

console.log("socketAPI OK !");

io.on('connection', function(socket) {
  console.log("New connection on socket");
});

socketAPI.sendNotification = function() {
  io.sockets.emit('hello', {msg:"Hello world !"});
}

module.exports = socketAPI;
