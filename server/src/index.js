import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { authRouter } from './routes/auth.js';
import { moviesRouter } from './routes/movies.js';
import { userRouter } from './routes/user.js';
import { adminRouter } from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

app.use((req, res) => res.status(404).json({ error: 'API not found' }));
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mp-movies');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
  }
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
};

start();
