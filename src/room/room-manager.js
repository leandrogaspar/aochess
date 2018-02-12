'use strict';
// 3rd party
const amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');

// our requires
const Model = require('../shared/model');
const Messages = Model.messages;
const MessageType = Model.MessageType;
const Queues = Model.Queues;
const Room = require('./room');

const rooms = {};

amqp.connect('amqp://localhost', function (err, conn) {
    if (err) {
        console.log(`Could not connect to RabbitMQ: ${err}`);
        return;
    }
    conn.createChannel(function (err, ch) {
        ch.assertQueue(Queues.ROOM_MNGTM, { durable: false });

        ch.prefetch(1);
        console.log('Waiting for ROOM_MNGTM messages...');
        ch.consume(Queues.ROOM_MNGTM, (message) => {
            const messageObj = JSON.parse(message.content.toString());
            console.log(`RoomManager received message ${messageObj}`);

            switch (messageObj.messageType) {
                case MessageType.CREATE_ROOM:
                    const newRoom = new Room(ch, messageObj.sessionId, messageObj.options);
                    if (newRoom.init()) {
                        rooms[newRoom.getRoomId()] = newRoom;
                        console.log(`RoomId[${newRoom.getRoomId()}] created with sucess`);
                        ch.ack(message); //TODO: this may lead to problems if sendToqueue is somehow called.. Investigate it
                    } else {
                        newRoom.close();
                    }
                    break;
                case MessageType.JOIN_ROOM:
                    console.log(`RoomManager received join room for roomId ${messageObj.roomId}`);
                    const room = rooms[messageObj.roomId];
                    if (room === undefined) {
                        // send error message?
                    }
                    room.joinRoom(messageObj.sessionId);
                    break;
                default:
                    console.log(`RoomManager - unknown message type: ${messageObj.messageType}`);
                    break;
            }
        });
    });
});
