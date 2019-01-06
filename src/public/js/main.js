$(function () {
	
	const socket = io();

	// --- Obtaining DOM elements from the interface

	// Chat
	const $contentWrap = $('#contentWrap');
	const $messageForm = $('#message-form');
	const $messageBox = $('#message');
	const $chat = $('#chat');

	// Nickname Form
	const $nickWrap = $('#nickWrap');
	const $nickForm = $('#nickForm');
	const $nickError = $('#nickError');
	const $nickname = $('#nickname');

	const $users = $('#usernames');

	$nickForm.submit(e => {
		e.preventDefault();

		socket.emit('new user', $nickname.val(), response => {
			
			if (response) {
				$nickWrap.hide();
				$contentWrap.fadeIn(300);
			} else {
				$nickError.html(`
					<div class="alert alert-danger">
						Username already exits!
					</div>
				`);
			}

			$nickname.val('');

		});

	});

	// --- Events

	$messageForm.submit(e => {
		
		e.preventDefault();
		
		socket.emit('send message', $messageBox.val(), error_message => {
			// --- Handle posible erros

			$chat.append(`<p class="text-danger">${error_message}</p>`);
		});

		$messageBox.val('');

	});

	socket.on('new message', function (response_object) {
		$chat.append("<p><b>" + response_object.nick + ": </b>" + response_object.message + "</p>");
	});

	socket.on('user list', user_list => {
		
		let html = '';

		for (let i = 0; i < user_list.length; i++) {
			html += `<p><i class="fas fa-user"></i> ${user_list[i]}</p>`;
		}

		$users.html(html);

	});

	socket.on('whisper', message => {
		displayMsg(message);
	});

	socket.on('load old messages', messages => {
		for (let i = 0; i < message.length; i++) {
			displayMsg(message[i]);
		}
	});

});

function displayMsg(message) {
	$chat.append(`<p class="text-secondary"><em><b>${message.nick}: </b>${message.message}</em></p>`);
}