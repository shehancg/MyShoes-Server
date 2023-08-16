import request from 'supertest';
import mongoose, {ConnectOptions} from 'mongoose';
import { app } from '../src'; // Adjust the path to your app entry file
import { ItemModel } from '../src/models/itemsModel';

describe('ItemController', () => {
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
        // Clear the items collection before each test
        await ItemModel.deleteMany({});
    });

    it('should get all items', async () => {
        // Create sample items in the test database
        await ItemModel.create([
            { name: 'Item 1' },
            { name: 'Item 2' },
            { name: 'Item 3' },
        ]);

        const res = await request(app).get('/api/items');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
        // Add more assertions if needed
    });

    it('should get an item by ID', async () => {
        // Create a sample item in the test database
        const newItem = await ItemModel.create({ name: 'Test Item' });

        const res = await request(app).get(`/api/items/${newItem._id}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe(newItem.name);

    });

});
