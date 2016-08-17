var express = require('express');
var socket_io = require('socket.io');
var http = require('http');

var app = express();

var server = http.Server(app);
var io = socket_io(server);

 
// Tracks how many users are online
var online = 0;
// All sockets are held here
var collection = [];

io.on('connection', function(socket){

	socket.on('NewUser', function(user){
		online = online + 1;
		console.log(user + ' Joined!');
		collection.push(socket.id);
		console.log(collection);
		socket.username = user;
		socket.broadcast.emit('NewUser', user);
	});

	socket.on('disconnect', function(){
		collection.splice(collection.indexOf(socket.id), 1);
		console.log(collection);
		online = online - 1;
		console.log('Users online: ' + online);
		socket.broadcast.emit('disconnect');
	});

	socket.on('message', function(message){
		name = socket.username;
		console.log('Message Received:', message);
		socket.broadcast.emit('message', message, name);
	});

});

app.use(express.static('public'));

server.listen(8080, function(){
	console.log('Listening on Port: 8080');
});