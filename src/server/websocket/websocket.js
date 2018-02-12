'use strict';
// 3rd party requires
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

// our requires
const Model = require('../../shared/model');
const Messages = Model.messages;
const SessionHandler = require('./session-handler');
const Session = require('./session');

module.exports.WebSocketServer = function WebSocketServer(httpServer) {
    const wsServer = new WebSocket.Server(httpServer);
    const sessionHandler = new SessionHandler();

    wsServer.on('connection', function onConnection(ws) {
        const uuid = uuidv4();

        const session = new Session(uuid, ws);
        sessionHandler.addSession(uuid, session);

        ws.on('error', (err) => console.log('error!', err));

        ws.on('close', (reason) => {
            sessionHandler.removeSession(uuid);
        });

        ws.on('message', function wsIncoming(message) {
            session.handleMessage(message);
        });

        const helloClient = Messages.helloClient(uuid);
        console.log(helloClient);

        session.sendMessage(JSON.stringify(helloClient));
    });
}
