import request from 'supertest';
import mongoose, {ConnectOptions} from 'mongoose';
import { app } from '../src'; // Adjust the path to your app entry file
import { OrderModel } from '../src/models/ordersModel';
import { OrderStatus } from '../src/configs/orderStatus';

describe('OrderController', () => {
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
        // Clear the orders collection before each test
        await OrderModel.deleteMany({});
    });

    it('should get all orders', async () => {
        // Create sample orders in the test database
        await OrderModel.create([
            { user: 'User 1', status: OrderStatus.NEW },
            { user: 'User 2', status: OrderStatus.PAID },
            { user: 'User 3', status: OrderStatus.SHIPPED },
        ]);

        const res = await request(app).get('/api/orders');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
        // Add more assertions if needed
    });

    it('should create an order', async () => {
        const orderData = {
            user: 'User 1',
            items: [{ name: 'Item 1' }],
            status: OrderStatus.NEW,
        };

        const res = await request(app).post('/api/orders').send(orderData);

        expect(res.status).toBe(200);
        expect(res.body.user).toBe(orderData.user);
        expect(res.body.items[0].name).toBe(orderData.items[0].name);
        expect(res.body.status).toBe(orderData.status);
        // Add more assertions if needed
    });

    // Add more test cases for other OrderController methods
});
