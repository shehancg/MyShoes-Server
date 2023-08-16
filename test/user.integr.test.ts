import request from 'supertest';
import mongoose, {ConnectOptions} from 'mongoose';
import { app } from '../src'; // Adjust the path to your app entry file
import { usersModel } from '../src/models/usersModel';
import bcrypt from "bcryptjs";

describe('UserController', () => {
    beforeAll(async () => {
        // Connect to a test database
        await mongoose.connect('mongodb://localhost/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }as ConnectOptions);
    });

    afterAll(async () => {
        // Disconnect from the test database
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear the users collection before each test
        await usersModel.deleteMany({});
    });

    it('should register a new user', async () => {
        const user = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password',
            phoneNo: '1234567890',
            location: 'Test Location',
            isAdmin: false,
        };

        const res = await request(app).post('/api/users/register').send(user);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe(user.name);
        expect(res.body.email).toBe(user.email);
        // Add more assertions if needed
    });

    it('should log in an existing user', async () => {
        // Create a user in the test database
        const hashedPassword = await bcrypt.hash('password', 11);
        await usersModel.create({
            name: 'Test User',
            email: 'test@example.com',
            passwordHash: hashedPassword,
            phoneNo: '1234567890',
            location: 'Test Location',
            isAdmin: false,
        });

        const res = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'password',
        });

        expect(res.status).toBe(200);
        expect(res.body.message.token).toBeDefined();
    });

});
