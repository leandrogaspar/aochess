(function(exports){
    const MessageType = {
        HELLO_CLIENT: 0,
    };

    function helloClient(sessionId) {
        return {
            messageType: MessageType.HELLO_CLIENT,
            sessionId: sessionId
        };
    }

    exports.MessageType = MessageType;
    exports.messages = {
        helloClient: helloClient,
    };
})(typeof exports === 'undefined'? this['Model']={}: exports);