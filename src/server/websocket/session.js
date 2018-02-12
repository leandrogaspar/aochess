'use strict';
// 3rd party
const amqp = require('amqplib/callback_api');

// our requires
const Model = require('../../shared/model');
const Messages = Model.messages;
const MessageType = Model.MessageType;
const Queues = Model.Queues;
const ErrorCode = Model.ErrorCode;

class Session {
    constructor(uuid, webSocket) {
        this.uuid = uuid;
        this.webSocket = webSocket;
        this.channel = undefined;

        webSocket.on('message', (message) => {
            this.handleWsMessage(message);
        });

        amqp.connect('amqp://localhost', (err, conn) => {
            if (err) {
                console.log(`Could not connect to RabbitMQ: ${err}`);
                this.sendWsMessage(Messages.error(ErrorCode.MSG_BROKER_CONNETION, err));
                return;
            }
            conn.createChannel((err, ch) => {
                if (err) {
                    console.log(`Could not create channel: ${err}`);
                    this.sendWsMessage(Messages.error(ErrorCode.MSG_BROKER_CHANNEL, err));
                    return;
                }
                this.channel = ch;

                ch.assertQueue(this.uuid, { exclusive: true });
                ch.consume(this.uuid, (message) => this.handleFwMessage(ch, message), { noAck: true });

                ch.assertQueue(Queues.ROOM_MNGTM, { durable: false });
            });
        });

        this.sendWsMessage(Messages.helloClient(uuid));
    }

    handleWsMessage(message) {
        let messageObj;
        console.log(`Session[${this.uuid}] - WsMessage rcvd: ${message}`);
        try {
            messageObj = JSON.parse(message);
        } catch (err) {
            console.log(`Session[${this.uuid}] - WsMessage could not parse msg: ${message}`);
            return;
        }
        switch (messageObj.messageType) {
            case MessageType.CREATE_ROOM:
                console.log(`Session[${this.uuid}] - Sending room creation request.`);
                this.sendFwMessage(Queues.ROOM_MNGTM, messageObj);
                break;
            default:
                console.log(`Session[${this.uuid}] - WsMessage unknown message type: ${messageObj.messageType}`);
                break;
        }
    }

    sendWsMessage(message) {
        try {
            this.webSocket.send(JSON.stringify(message));
        } catch (err) {
            console.log(`Session[${this.uuid}] - Could not send message due to unexpected exception: ${err}`);
        }
    }

    handleFwMessage(ch, message) {
        console.log(`Session[${this.uuid}] - FwMessage rcvd: ${message}`);
        ch.ack(msg);
    }

    sendFwMessage(queue, message) {
        if (this.channel === undefined) {
            console.log(`Session[${this.uuid}] - sendFwMessage channel closed. Message will be discarded`);
            return;
        }
        this.channel.sendToQueue(queue, new Buffer(JSON.stringify(message)));
    }
}

module.exports = Session;
