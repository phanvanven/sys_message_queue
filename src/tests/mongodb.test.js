'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const connectString = process.env.MONGO_URL_HOST;

const TestSchema = new mongoose.Schema({
    name: String
});

const Test = mongoose.model('Test', TestSchema);

describe('Mongoose Connection', ()=>{
    let connection;
    beforeAll(async() =>{
        connection = await mongoose.connect(connectString);
    });

    afterAll(async()=>{
        await connection.disconnect();
    });

    it('should connect to mongoose', ()=>{
        expect(mongoose.connection.readyState).toBe(1);
    });

    it('should save a document to the database', async ()=>{
        const user = new Test({
            name: "NoName",
        });

        await user.save();
        expect(user.isNew).toBe(false);
    });

    it('should find a document to the database', async ()=>{
        const user = await Test.findOne({
            name: "NoName"
        })
        expect(user).toBeDefined();
        expect(user.name).toBe("NoName");
    });
})