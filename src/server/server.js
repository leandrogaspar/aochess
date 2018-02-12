// server.js
// 3rd party requires
const express = require('express');

// our requires
const WebSocketServer = require('./websocket').WebSocketServer;

const app = express();

// TOOD: Configure the listen address
const server = app.listen(3000);


// Start our websocket server
WebSocketServer({server});

// this will make Express serve your static files
app.use(express.static(__dirname + '/public'));
