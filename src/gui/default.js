var websocket = new WebSocket('ws://localhost:3000/ws');
var sessionId = undefined;
var reqId = 0;

websocket.onclose = function (reason) {
    console.log(`Websocket closed![${reason}]`);
}

websocket.onopen = function () {
    console.log('Websocket open!');
}

websocket.onerror = function (err) {
    console.log(`received error [${err}]`);
}

websocket.onmessage = function (message) {
    console.log(`received msg [${message.data}]`);
    const messageObj = JSON.parse(message.data);
    const messageType = messageObj.messageType;
    if (messageType === Model.MessageType.HELLO_CLIENT) {
        sessionId = messageObj.sessionId;
        console.log(`Session id assigned ${sessionId}`);
    }
}

function sendMessage() {
    reqId++;
    const message = {
        messageType: document.getElementById('messageType').value,
        reqId: reqId,
        data: document.getElementById('data').value
    }
    websocket.send(JSON.stringify(message));
}

function createRoom() {
    if (sessionId === undefined) {
        return;
    }
    reqId++;
    const message = Model.messages.createRoom(reqId, sessionId, {});
    websocket.send(JSON.stringify(message));
}

function joinRoom() {
    if (sessionId === undefined) {
        return;
    }
    reqId++;
    const message = Model.messages.joinRoom(reqId, document.getElementById('roomId').value, sessionId);
    websocket.send(JSON.stringify(message));
}
