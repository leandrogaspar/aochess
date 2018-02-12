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
    
      ws.on('error', () => console.log('errored'));
    
      ws.on('close', () => console.log('closed'));
    
      ws.on('message', function wsIncoming(data) {
        console.log(data);
      });
    
      const helloClient = Messages.helloClient(uuid);
      console.log(helloClient);
    
      ws.send(JSON.stringify(helloClient));
    });
}