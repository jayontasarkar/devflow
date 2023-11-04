import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);
  const mongoDBUrl = process.env.MONGODB_URL;

  if (!mongoDBUrl) {
    return console.log('MISSING MONGODB_URL');
  }

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(mongoDBUrl, {
    
    });
    isConnected = true;
    console.log('🚀 MongoDB connected successfully!')
  } catch (error) {
    console.log('MongoDB connection failed error: ', error);
  }
};