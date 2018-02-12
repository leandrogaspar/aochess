(function (exports) {
    const MessageType = {
        HELLO_CLIENT: 0,
        CREATE_ROOM: 0,
    };

    function helloClient(sessionId) {
        return {
            messageType: MessageType.HELLO_CLIENT,
            sessionId: sessionId
        };
    }

    function createRoom(sessionId) {
        return {
            messageType: MessageType.HELLO_CLIENT,
            sessionId: sessionId
        };
    }

    exports.MessageType = MessageType;
    exports.messages = {
        helloClient: helloClient,
    };
})(typeof exports === 'undefined' ? this['Model'] = {} : exports);