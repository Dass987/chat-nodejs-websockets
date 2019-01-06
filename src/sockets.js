const Chat = require('./models/Chat');

module.exports = function (io) {

	let users = {};

	io.on('connection', async socket => {
		console.log('New user connected');

		let messages = await Chat.find();
		socket.emit('load old messages', messages);

		socket.on('new user', (user, callback) => {
			
			if (user in users) {
				callback(false);
			} else {

				callback(true);
				
				socket.nickname = user;
				users[socket.nickname] = socket;
				updateNicknames();

			}

		});

		socket.on('send message', async (message, callback) => {
			
			var msg = message.trim();

			if (msg.substr(0, 3) === '/w ') {

				msg = msg.substr(3);
				const index = msg.indexOf(' ');

				if (index !== -1) {

					var name = msg.substring(0, index);
					msg = msg.substring(index + 1);

					if (name in users) {

						users[name].emit('whisper', {
							message: msg,
							nick: socket.nickname
						});
						
					} else {
						callback("Error! Please enter a valid user name");
					}

				} else {
					callback('Error! Please enter a valid message');
				}

			} else {

				var newMsg = new Chat({
					nick: socket.nickname,
					msg
				});
				
				await newMsg.save();

				io.sockets.emit('new message', {
					message,
					nick: socket.nickname
				});

			}

		});

		socket.on('disconnect', user => {

			if (!socket.nickname) return;
			delete users[socket.nickname];
			updateNicknames();

		});

	});

	function updateNicknames() {
		io.sockets.emit('user list', Object.keys(users));
	}

}