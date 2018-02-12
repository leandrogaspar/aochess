'use strict';
// 3rd party requires
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

// our requires
const Model = require('../shared/model');
const Messages =  Model.messages;

module.exports.WebSocketServer = function WebSocketServer(httpServer) {
    const wsServer = new WebSocket.Server(httpServer);

    wsServer.on('connection', function onConnection(ws) {
        const uuid = uuidv4();

        console.log(uuid);

        ws.on('error', (err) => console.log('error!', err));

        ws.on('close', (reason) => console.log('closed', reason));
    
        ws.on('message', function wsIncoming(message) {
            console.log(message);
        });

        const helloClient = Messages.helloClient(uuid);
        console.log(helloClient);

        ws.send(JSON.stringify(helloClient));
    });
}
