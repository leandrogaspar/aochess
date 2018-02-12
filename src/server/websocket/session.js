'use strict';
// 3rd party
const amqp = require('amqplib/callback_api');

// our requires
const Model = require('../../shared/model');
const Messages = Model.messages;

class Session {
    constructor(uuid, webSocket) {
        this.uuid = uuid;
        this.webSocket = webSocket;

        webSocket.on('message', (message) => {
            this.handleWsMessage(message);
        });

        amqp.connect('amqp://localhost', (err, conn) => {
            if (err) {
                console.log(`Could not connect to RabbitMQ: ${err}`);
                this.sendMessage(Messages.error(Model.ErrorCode.MSG_BROKER_CONNETION, err));
                return;
            }
            conn.createChannel((err, ch) => {
                if (err) {
                    console.log(`Could not create channel: ${err}`);
                    this.sendMessage(Messages.error(Model.ErrorCode.MSG_BROKER_CHANNEL, err));
                    return;
                }

                ch.assertQueue(this.uuid, { exclusive: true });
                ch.consume(this.uuid, (message) => this.handleFwMessage(ch, message), { noAck: true });

                ch.assertQueue(Model.Queues.ROOM_MNGTM, { durable: false });
                ch.sendToQueue(Model.Queues.ROOM_MNGTM, new Buffer('Test!!!'));
            });
        });

        this.sendMessage(Messages.helloClient(uuid));
    }

    handleWsMessage(message) {
        console.log(`Session[${this.uuid}] - WsMessage rcvd: ${message}`);
    }

    handleFwMessage(ch, message) {
        console.log(`Session[${this.uuid}] - FwMessage rcvd: ${message}`);
        ch.ack(msg);
    }

    sendMessage(message) {
        try {
            this.webSocket.send(JSON.stringify(message));
        } catch (err) {
            console.log(`Session[${this.uuid}] - Could not send message due to unexpected exception: ${err}`);
        }
    }
}

module.exports = Session;
