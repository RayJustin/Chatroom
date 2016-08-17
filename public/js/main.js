$(document).ready(function(){

	var socket = io();

	var input = $('#chat');
	var messages = $('#messages');
	var usersOnline = $('.usersOnline');

	var addMessage = function(message, name){
		if(name === undefined){
			name = 'You';
		}
		messages.append('<div class="message">'+ name + ': ' + message + '</div>');
	}

	var addUser = function(user){
		messages.append('<div class="userJoined"><strong>' + user + ' has joined the chat </strong></div>');
	}

	var updateList = function(arr){
		$('.user').remove();
		console.log(arr);
		for(var i = 0; i < arr.length; i++){
			usersOnline.append('<div class="user"<strong>' + arr[i] + '</strong></div>');
		}
	}

	input.on('keydown', function(event){
		if(event.keyCode != 13){
			return;
		}
		var message = input.val();
		addMessage(message);
		socket.emit('message', message);
		input.val('');
	});

	socket.on('connect', function(){
		var user = prompt('Welcome. Please enter your name.');
		// Need to add something so the user cant be null or blank
		addUser(user);
		socket.emit('newUser', user);
		socket.emit('list', user);
	});

	socket.on('list', updateList);
	socket.on('newUser', addUser);
	socket.on('msg', addMessage);
	socket.on('userLeft', function(user){
		messages.append('<div class="userJoined"><strong>' + user + ' has left the chat </strong></div>');
	});
});

