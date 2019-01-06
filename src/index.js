const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

// --- Db connection

mongoose.connect('mongodb://keagen100:keagen100@ds111895.mlab.com:11895/chat-database')
	.then(db => console.log('db is connected'))
	.catch(err => console.log(err));

// --- Settings

app.set('port', process.env.PORT || 3030);

require('./sockets')(io);

// --- Static files
app.use(express.static(path.join(__dirname, 'public')));

// --- Starting the server
server.listen(app.get('port'), () => {
	console.log('server on port ' + app.get('port'));
});