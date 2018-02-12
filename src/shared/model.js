(function (exports) {
    const MessageType = {
        ERROR: 0,
        HELLO_CLIENT: 1,
        CREATE_ROOM: 2,
        ROOM_CREATED: 3,
        JOIN_ROOM: 4,
        ROOM_JOINED: 5,
    };

    const Queues = {
        ROOM_MNGTM: 'room-management',
    };

    const ErrorCode = {
        MSG_BROKER_CONNETION: 0,
        MSG_BROKER_CHANNEL: 1,
    }

    function helloClient(sessionId) {
        return {
            messageType: MessageType.HELLO_CLIENT,
            sessionId: sessionId
        };
    }

    function createRoom(sessionId, options) {
        return {
            messageType: MessageType.CREATE_ROOM,
            sessionId: sessionId,
            options: options
        };
    }

    function roomCreated(roomId) {
        return {
            messageType: MessageType.ROOM_CREATED,
            roomId: roomId
        };
    }

    function joinRoom(roomId, sessionId) {
        return {
            messageType: MessageType.JOIN_ROOM,
            roomId: roomId,
            sessionId: sessionId
        };
    }

    function roomJoined(roomId) {
        return {
            messageType: MessageType.ROOM_JOINED,
            roomId: roomId
        };
    }

    function error(code, data) {
        return {
            messageType: MessageType.ERROR,
            code: code,
            data: data,
        };
    }

    exports.MessageType = MessageType;
    exports.Queues = Queues;
    exports.ErrorCode = ErrorCode;
    exports.messages = {
        helloClient: helloClient,
        createRoom: createRoom,
        roomCreated: roomCreated,
        joinRoom: joinRoom,
        roomJoined: roomJoined,
        error: error,
    };
})(typeof exports === 'undefined' ? this['Model'] = {} : exports);