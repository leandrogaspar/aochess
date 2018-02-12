'use strict';
// 3rd party
const amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');

// our requires
const Model = require('../shared/model');
const Messages = Model.messages;
const Queues = Model.Queues;

class Room {
    constructor(channel, ownerId, options) {
        this.channel = channel;
        this.roomId = uuidv4();
        this.roomConsumerTag = undefined;
        this.ownerId = ownerId;
        this.options = options;
    }

    init() {
        try {
            this.channel.assertQueue(this.roomId, { durable: false });
            this.channel.consume(this.roomId, (message) => this.handleFwMessage(ch, message));

            this.channel.assertQueue(this.ownerId, { durable: false });
            const roomCreated = Messages.roomCreated(this.roomId);
            this.channel.sendToQueue(this.ownerId, new Buffer(JSON.stringify(roomCreated)));
            console.log('hey');
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

    handleFwMessage(ch, message) {
        console.log(`Session[${this.uuid}] - FwMessage rcvd: ${message.content.toString()}`);
        ch.ack(message);
    }
}

module.exports = Room;