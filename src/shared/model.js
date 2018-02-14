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
        ROOM_NOT_FOUND: 2,
        ROOM_FAIL_TO_INIT: 3,
        UNKNOWN_REQUEST: 4,
    }

    function helloClient(sessionId) {
        return {
            messageType: MessageType.HELLO_CLIENT,
            sessionId: sessionId
        };
    }

    function createRoom(reqId, sessionId, options) {
        return {
            messageType: MessageType.CREATE_ROOM,
            reqId: reqId,
            sessionId: sessionId,
            options: options
        };
    }

    function roomCreated(reqId, roomId) {
        return {
            messageType: MessageType.ROOM_CREATED,
            reqId: reqId,
            roomId: roomId
        };
    }

    function joinRoom(reqId, roomId, sessionId) {
        return {
            messageType: MessageType.JOIN_ROOM,
            reqId: reqId,
            roomId: roomId,
            sessionId: sessionId
        };
    }

    function roomJoined(reqId, roomId) {
        return {
            messageType: MessageType.ROOM_JOINED,
            reqId: reqId,
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

    function requestError(reqId, code, data) {
        return {
            messageType: MessageType.ERROR,
            reqId: reqId,
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
        requestError: requestError,
    };
})(typeof exports === 'undefined' ? this['Model'] = {} : exports);