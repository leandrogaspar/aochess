class Session {
    constructor(uuid, webSocket) {
        this.uuid = uuid;
        this.webSocket = webSocket;
    }

    handleMessage(message) {
        console.log("message rcvd", message);
    }

    sendMessage(message) {
        this.webSocket.send(message);
    }
}

module.exports = Session;
