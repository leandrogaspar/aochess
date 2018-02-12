'use strict';
// our requires
const Model = require('../../shared/model');
const Messages = Model.messages;

class Session {
    constructor(uuid, webSocket) {
        this.uuid = uuid;
        this.webSocket = webSocket;

        webSocket.on('message', (message) => {
            this.handleMessage(message);
        });

        this.sendMessage(Messages.helloClient(uuid));
    }

    handleMessage(message) {
        console.log(`Session[${this.uuid}] - Message rcvd: ${message}`);
    }

    sendMessage(message) {
        try {
            this.webSocket.send(JSON.stringify(message));
        } catch (err) {
            console.log(`Session[${this.uuid}] - Could not send message due to unexpected exception: ${err}`);
        }

    }
}

module.exports = Session;
