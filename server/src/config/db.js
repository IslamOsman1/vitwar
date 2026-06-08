import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is missing. Add it to server/.env before starting the server.');
    }

    if (mongoUri.includes('@cluster.mongodb.net')) {
      throw new Error(
        'MONGO_URI is using the Atlas placeholder host "cluster.mongodb.net". Replace it with your real cluster hostname, for example "cluster0.xxxxx.mongodb.net".'
      );
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB error: ${error.message}`);
    process.exit(1);
  }
};
