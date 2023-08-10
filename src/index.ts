import express from 'express';
import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import itemRoutes from "./routes/itemRoutes";

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('tiny'));

const PORT = process.env.PORT || 3001;
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
    throw new Error('DB_URI environment variable is not defined');
}

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// IMPORT ROUTES FILES
app.use('/api/users', userRoutes);
app.use('/api/items',itemRoutes)

mongoose.set('strictQuery', false);

(async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'MYSHOESDB', // Specify the database name here
        } as ConnectOptions);
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
})();
