'use strict';

const {
    consumerQueue,
    connectToRabbitMQ
} = require('../dbs/init.rabbit');

const messageService = {
    consumerToQueue: async(queueName)=>{
        try {
            const {channel, connection} = await connectToRabbitMQ();
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.log('Error consumerToQueue: ', error);
        }
    },

    // proccessing case
    consumerToQueueNormal: async(nameQueue)=>{
        try {
            const {channel, connection} = await connectToRabbitMQ();
            const notificationQueue = 'notificationQueueProcess';
            const timeExpired = 15000;
            setTimeout(()=>{
                channel.consume(notificationQueue, msg =>{
                    console.log(`Notification sent successfully: ${msg.content.toString()}`);
                    channel.ack(msg);
                })
            }, timeExpired);
        } catch (error) {
            console.error(error);
        }
    },

    // failure case
    consumerToQueueFailed: async(nameQueue)=>{
        try {
            const {channel, connection} = await connectToRabbitMQ();
            const notificationExchangeDLX = 'notificationExDLX'; // direct exchange (failure case)
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assert
            const notificationHandler = 'notificationQueueHotFix';
            
            await channel.assertExchange(notificationExchangeDLX, 'direct',{
                durable: true,
            });

            const queueResult = await channel.assertQueue(notificationHandler, {
                exclusive: false
            });

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX);
            await channel.consume(queueResult.queue, msgFailed =>{
                console.log(`this connection error, pls hot fix: ${msgFailed.content.toString()}`);
            },{
                noAck: true
            })
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = messageService;