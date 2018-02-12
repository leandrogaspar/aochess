// app.js
// 3rd party requires
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const express = require('express');

// our requires
const Model = require('./src/shared/model');
const Messages =  Model.messages;

const app = express();

// TOOD: Configure the listen address
const server = app.listen(3000);
const wsServer = new WebSocket.Server({ server });

// this will make Express serve your static files
app.use(express.static(__dirname + '/public'));

wsServer.on('connection', function onConnection(ws) {
  const uuid = uuidv4();

  console.log(uuid);

  ws.on('error', () => console.log('errored'));

  ws.on('close', () => console.log('closed'));

  ws.on('message', function wsIncoming(data) {
    console.log(data);
  });

  const helloClient = Messages.helloClient(uuid);
  console.log(helloClient);

  ws.send(JSON.stringify(helloClient));
});



