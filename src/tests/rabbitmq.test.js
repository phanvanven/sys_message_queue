'use strict';

const { iteratee } = require('lodash');
const {
    connectToRabbitMQForTest
} = require('../dbs/init.rabbit');

describe('RabbitMQ Connection', () =>{
    it('should connect to successul RabbitMQ', async()=>{
        const result = await connectToRabbitMQForTest();
        expect(result).toBeUndefined();
    })
})