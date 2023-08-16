import express from 'express';
import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';
import itemRoutes from "./routes/itemRoutes";
import orderRoutes from "./routes/orderRoutes";
import * as path from "path";

dotenv.config(); // Load environment variables from .env file

export const app = express();
const WebSocket = require('ws');
const wssChat = new WebSocket.Server({ port:8000 });

// CORS CONFIG
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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
app.use('/api/items',itemRoutes);
app.use('/api/orders',orderRoutes);

app.use('/assets/uploads', express.static(path.join(__dirname, '../assets/uploads')));

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

// WEBSOCKET IMPLEMENTATION
let chatClients: any[]=[];

wssChat.on('connection', (ws:any, req:any) => {

    console.log('New connection established - chat');


    chatClients.push(ws);

    ws.on('message', (data: any) => {
        chatClients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN ) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        chatClients = chatClients.filter((client) => client !== ws);
    });
});
