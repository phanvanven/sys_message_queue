'use strict';

const amqp = require('amqplib');
const connectToRabbitMQ = async()=>{
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        if(!connection) throw new Error("Connection not established");

        const channel = await connection.createChannel();
        return {
            channel,
            connection
        }
    } catch (error) {
        console.log(`Error connecting to RabbitMQ: `, error);
        throw error;
    }
}

const connectToRabbitMQForTest = async ()=>{
    try {
        const {
            channel,
            connection
        } = await connectToRabbitMQ();
        // Publish message to a queue
        const queue = 'test-queue';
        const message = 'Hello, shopDEV';
        await channel.assertQueue(queue);
        await channel.sendToQueue(queue, Buffer.from(message));
        // close the connection
        await connection.close();
    } catch (error) {
        console.log(`Error connecting to RabbitMQ: `, error);
    }
}

const consumerQueue = async(channel, queueName) =>{
    try {
        await channel.assertQueue(queueName, {
            durable: true
        });
        console.log('Waiting for messages...');
        channel.consume(queueName, msg =>{
            console.log(`Received message: ${queueName} - ${msg.content.toString()}`);
            // After receiving the shop's event
            // 1. find Users who have followed Shop
            // 2. send message to Users
            // 3. OK -> success
            // 4. Error -> setup DLX...
        },{
            noAck: true
        });
    } catch (error) {
        console.log('error publish message to rabbitMQ: ', error);
        throw error;
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}