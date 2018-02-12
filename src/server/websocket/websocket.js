'use strict';
// 3rd party requires
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

// our requires
const SessionHandler = require('./session-handler');
const Session = require('./session');

module.exports.WebSocketServer = function WebSocketServer(httpServer) {
    const wsServer = new WebSocket.Server(httpServer);
    const sessionHandler = new SessionHandler();

    wsServer.on('connection', function onConnection(ws) {
        const uuid = uuidv4();

        const session = new Session(uuid, ws);
        sessionHandler.addSession(uuid, session);

        // We handle the connection stuff here
        // leave the messages for the Session()
        ws.on('error', (err) => {
            console.log(`Session[${uuid}] - WebSocket error: ${err}`);
        });

        ws.on('close', (reason) => {
            sessionHandler.removeSession(uuid);
        });
    });
}
