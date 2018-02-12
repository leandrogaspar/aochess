'use strict';
// 3rd party
const amqp = require('amqplib/callback_api');

// our requires
const Model = require('../shared/model');
const Messages = Model.messages;

amqp.connect('amqp://localhost', function (err, conn) {
    if (err) {
        console.log(`Could not connect to RabbitMQ: ${err}`);
        return;
    }
    conn.createChannel(function (err, ch) {
        ch.assertQueue(Model.Queues.ROOM_MNGTM, { durable: false });

        ch.prefetch(1);
        console.log('Waiting for ROOM_MNGTM messages...');
        ch.consume(Model.Queues.ROOM_MNGTM, (message) => {
            const messageObj = JSON.parse(message.content.toString());
            console.log(messageObj);
            ch.ack(message);
        });
    });
});
