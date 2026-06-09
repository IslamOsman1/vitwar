import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it to server/.env before starting the server.');
  }

  if (mongoUri.includes('@cluster.mongodb.net')) {
    throw new Error(
      'MONGO_URI is using the Atlas placeholder host "cluster.mongodb.net". Replace it with your real cluster hostname, for example "cluster0.xxxxx.mongodb.net".'
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn.connection;
};
