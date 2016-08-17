var express = require('express');
var socket_io = require('socket.io');
var http = require('http');
var app = express();
var server = http.Server(app);
var io = socket_io(server);


// Socket.id's are held here
var collection = [];
// Socket.username's are held here
var userNames = [];

io.on('connection', function(socket){

	socket.on('newUser', function(user){
		console.log(user + ' Joined!');
		collection.push(socket.id);
		userNames.push(user);
		socket.username = user;

		socket.emit('list', userNames);
		socket.broadcast.emit('newUser', user);
	});

	socket.on('disconnect', function(){
		collection.splice(collection.indexOf(socket.id), 1);

		for(var i = 0; i < userNames.length; i++){
			if(userNames[i] === socket.username){
				userNames.splice(i, 1);
				break;
			}
		}
		socket.broadcast.emit('list', userNames);
		socket.broadcast.emit('userLeft', socket.username);
	});

	socket.on('list', function(){
		socket.broadcast.emit('list', userNames);
	});

	socket.on('message', function(message){
		name = socket.username;
		console.log('Message Received:', message);

		socket.broadcast.emit('msg', message, name);
	});

});

app.use(express.static('public'));

server.listen(process.env.PORT || 8080, function(){
	console.log('Listening on Port: 8080');
});