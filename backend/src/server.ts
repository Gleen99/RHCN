import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import config from 'config';

const app = express();
const port = config.get<number>('server.port');

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: config.get<string>('server.JSON_SIZE_LIMIT') }));

// Connect to MongoDB
mongoose.connect(config.get<string>('database.mongo.host'))
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));


app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});