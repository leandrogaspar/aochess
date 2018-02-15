'use strict';
// 3rd party
const amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');

// our requires
const Model = require('../shared/model');
const Messages = Model.messages;
const MessageType = Model.MessageType;
const Queues = Model.Queues;

class Room {
    constructor(channel, ownerId, options) {
        this.channel = channel;
        this.roomId = uuidv4();
        this.roomConsumerTag = undefined;
        this.ownerId = ownerId;
        this.options = options;
        this.guestId = undefined;
    }

    init(reqId) {
        try {
            this.channel.assertQueue(this.roomId, { durable: false });
            this.channel.consume(this.roomId, (message) => this.handleFwMessage(message));

            this.channel.assertQueue(this.ownerId, { durable: false });
            const roomCreated = Messages.roomCreated(reqId, this.roomId);
            this.channel.sendToQueue(this.ownerId, new Buffer(JSON.stringify(roomCreated)));
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    close() {
        // todo close the consume(this.roomId)
        this.channel = undefined;
        this.roomId = undefined;
        this.ownerId = undefined;
        this.options = undefined;
    }

    getRoomId() {
        return this.roomId;
    }

    handleFwMessage(message) {
        const messageObj = JSON.parse(message.content.toString());
        console.log(`Room[${this.roomId}] - FwMessage rcvd: ${message.content.toString()}`);
        switch (messageObj.messageType) {
            case MessageType.SEND_MESSAGE:
                this.newMessage(messageObj);
            default:
                break;
        }
        this.channel.ack(message);
    }

    joinRoom(reqId, guestId) {
        this.guestId = guestId;
        this.channel.assertQueue(this.guestId, { durable: false });
        const roomCreated = Messages.roomJoined(reqId, this.roomId);
        this.channel.sendToQueue(this.guestId, new Buffer(JSON.stringify(roomCreated)));
    }

    newMessage(messageObj) {
        if (messageObj.sessionId !== this.ownerId && messageObj.sessionId !== this.guestId) {
            const error = Messages.requestError(reqId, ErrorCode.NOT_IN_ROOM);
            this.sendMessage(this.channel, messageObj.sessionId, error);
        }

        // Send the message received confirmation
        const messageSentEvent = Messages.messageSent();
        this.sendMessage(this.channel, messageObj.sessionId, messageSentEvent);

        // Send the message to the other party
        const newMessageEvent = Messages.newMessage(messageObj.message);
        if (messageObj.sessionId === this.ownerId) {
            this.sendMessage(this.channel, this.guestId, newMessageEvent);
        } else {
            this.sendMessage(this.channel, this.ownerId, newMessageEvent)
        }
    }

    // TODO room manager also uses this code... fix it!
    sendMessage(channel, sessionId, messageObj) {
        try {
            channel.assertQueue(sessionId, { durable: false });
            channel.sendToQueue(sessionId, new Buffer(JSON.stringify(messageObj)));
        } catch (err) {
            console.log(`RoomManager - Unexpected error sending message: ${err}`);
        }
    }
}



module.exports = Room;