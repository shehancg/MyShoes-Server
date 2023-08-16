import request from 'supertest';
import { usersModel } from '../src/models/usersModel';
import { app } from '../src';
import mongoose from 'mongoose';
import { Server as WebSocketServer } from 'ws'; // Import WebSocketServer if needed

describe('GET /', () => {

    // Set up WebSocket server and MongoDB connection
    let wssChat: WebSocketServer;

    beforeAll(() => {
        wssChat = new WebSocketServer({ noServer: true });
        // Initialize other setup if needed
    });

    // Close WebSocket server and MongoDB connection after all tests
    afterAll(async () => {
        await mongoose.connection.close();
        wssChat.close();
    });

    it('should return all users', async () => {
        const userData = [
            { name: 'User 1' },
            { name: 'User 2' },
            { name: 'User 3' },
        ];

        await usersModel.create(userData);

        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(3);
        expect(res.body.map((u: any) => u.name)).toEqual(
            expect.arrayContaining(userData.map((u: any) => u.name))
        );
    });

    it('should return 500 when no users found', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});
