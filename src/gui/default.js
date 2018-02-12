console.log('Hello world!');

//Test if we can use our Model..
console.log(Model.MessageType);

var websocket = new WebSocket('ws://localhost:3000/ws');
websocket.onclose = function(reason) {
    console.log(`Websocket closed![${reason}]`);
}

websocket.onopen = function() {
    console.log('Websocket open!');
    websocket.send('Hello world!');
    
}

websocket.onerror = function(err) {
    console.log(`received error [${err}]`);
}

websocket.onmessage = function(message) {
    console.log(`received msg [${message.data}]`);
}

