const websocket = new WebSocket('ws://localhost:3000/ws');
var sessionId = undefined;
var reqId = 0;
const MessageType = Model.MessageType;

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
    switch(messageType) {
        case MessageType.HELLO_CLIENT:
            sessionId = messageObj.sessionId;
            log(`Session id assigned ${sessionId}`);
            break;
        case MessageType.ROOM_CREATED:
            log(`Created Room id: ${messageObj.roomId}`);
            break;
        case MessageType.ROOM_JOINED:
            log(`Room id ${messageObj.roomId} joined`);
            break;
        case MessageType.NEW_MESSAGE:
            log("Rcvd message: " + messageObj.message);
            break;
        default:
            break;
    }
}

function sendWsMessage() {
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

function sendMessage() {
    if (sessionId === undefined) {
        return;
    }
    reqId++;
    const message = Model.messages.sendMessage(reqId, document.getElementById('message').value);
    websocket.send(JSON.stringify(message));
    log("Sent message: " + message.message);
}

function log(text) {
    const textArea = document.getElementById("log-area");
    textArea.innerHTML = textArea.innerHTML + text + "\n";
}