'use strict';
// 3rd party
const amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');

// our requires
const Model = require('../shared/model');
const Messages = Model.messages;
const MessageType = Model.MessageType;
const Queues = Model.Queues;
const ErrorCode = Model.ErrorCode;
const Room = require('./room');

const rooms = {};

amqp.connect('amqp://localhost', function (err, conn) {
    if (err) {
        console.log(`RoomManager - Could not connect to RabbitMQ: ${err}`);
        return;
    }
    conn.createChannel(function (err, ch) {
        ch.assertQueue(Queues.ROOM_MNGTM, { durable: false });

        ch.prefetch(1);
        console.log('RoomManager - Waiting for ROOM_MNGTM messages...');
        ch.consume(Queues.ROOM_MNGTM, (message) => {
            let messageObj;
            try {
                messageObj = JSON.parse(message.content.toString());
            } catch (err) {
                console.log(`RoomManager - Could not parse rcvd message. Message will be discarded. Error: ${err}`);
                ch.ack(message);
                return;
            }

            if (!isValidRequestMessage(messageObj)) {
                console.log('RoomManager - Invalid message received will be discarded.');
                ch.ack(message);
                return;
            }

            console.log(`RoomManager - received message ${messageObj} reqId ${messageObj.reqId}`);

            switch (messageObj.messageType) {
                case MessageType.CREATE_ROOM:
                    handleCreateRoom(ch, message, messageObj);
                    break;
                case MessageType.JOIN_ROOM:
                    handleJoinRoom(ch, message, messageObj);
                    break;
                default:
                    console.log(`RoomManager - unknown message type: ${messageObj.messageType}`);
                    const error = Messages.requestError(messageObj.reqId, ErrorCode.UNKNOWN_REQUEST);
                    sendMessage(channel, messageObj.sessionId, error);
                    break;
            }
        });
    });
});

function handleCreateRoom(channel, message, messageObj) {
    console.log('RoomManager - received create room request');
    const reqId = messageObj.reqId;
    const newRoom = new Room(channel, messageObj.sessionId, messageObj.options);
    if (newRoom.init(reqId)) {
        rooms[newRoom.getRoomId()] = newRoom;
        console.log(`RoomManager - RoomId[${newRoom.getRoomId()}] created with sucess`);
        channel.ack(message); //TODO: this may lead to problems if sendToqueue is somehow called.. Investigate it
    } else {
        const error = Messages.requestError(reqId, ErrorCode.ROOM_FAIL_TO_INIT);
        sendMessage(channel, messageObj.sessionId, error);
        newRoom.close();
        channel.ack(message); //TODO: should we ack here? Since we are sending an error message i guess it is ok to realy fail..
    }
}

function handleJoinRoom(channel, message, messageObj) {
    console.log(`RoomManager - received join room for roomId ${messageObj.roomId}`);
    const reqId = messageObj.reqId;
    const room = rooms[messageObj.roomId];
    if (room === undefined) {
        const error = Messages.requestError(reqId, ErrorCode.ROOM_NOT_FOUND);
        sendMessage(channel, messageObj.sessionId, error);
        channel.ack(message);
        return;
    }
    console.log(`RoomManager - roomId ${messageObj.roomId} joined.`);
    room.joinRoom(reqId, messageObj.sessionId);
    channel.ack(message);
}

// TODO: this will probably be used somewhere else, maybe put in a shared js?
function sendMessage(channel, sessionId, message) {
    try {
        channel.assertQueue(messageObj.sessionId, { durable: false });
        channel.sendToQueue(messageObj.sessionId, new Buffer(JSON.stringify(error)));
    } catch (err) {
        console.log(`RoomManager - Unexpected error sending message: ${err}`);
    }
}

function isValidRequestMessage(message) {
    if (message.sessionId === undefined) {
        console.log('RoomManager - Missing sessionId');
        return false;
    } else if (message.reqId === undefined) {
        console.log('RoomManager - Missing reqId');
        return false;
    }
    return true;
}
