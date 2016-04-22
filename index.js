var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serialArduino = require('./serialArduino');

app.get('/', function(req, res){
  res.sendfile('index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var callback = function(data){
	io.emit('serial data', data);
}

serialArduino.initiateCommunication(callback);
