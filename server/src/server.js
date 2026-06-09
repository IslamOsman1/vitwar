import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

let connectTimeout = null;
let connecting = false;

const scheduleReconnect = (delayMs = 10000) => {
  if (connectTimeout || mongoose.connection.readyState === 1 || connecting) {
    return;
  }

  connectTimeout = setTimeout(() => {
    connectTimeout = null;
    startDatabaseConnection();
  }, delayMs);
};

const startDatabaseConnection = async () => {
  if (connecting || mongoose.connection.readyState === 1) {
    return;
  }

  connecting = true;

  try {
    await connectDB();
  } catch (error) {
    console.error(`MongoDB error: ${error.message}`);
    scheduleReconnect();
  } finally {
    connecting = false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Retrying connection...');
  scheduleReconnect(3000);
});

mongoose.connection.on('error', (error) => {
  console.error(`MongoDB connection error: ${error.message}`);
});

startDatabaseConnection();

export default server;
