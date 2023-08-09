import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3001;
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
    throw new Error('DB_URI environment variable is not defined');
}

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

mongoose.set("strictQuery", false);

mongoose.connect(DB_URI).then(async () => {
    console.log('Connected to MongoDB');

    // Create a new database and collection
    const newDb = mongoose.connection.useDb('MYSHOESDB');
    /*const collectionName = 'newcollection';

    await newDb.createCollection(collectionName);
    console.log(`Created collection: ${collectionName}`);*/


})
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
