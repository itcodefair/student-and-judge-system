import { MongoClient } from 'mongodb'
const MONGODB_URI = process.env.MONGODB_URI

let client: MongoClient

const connectDB = async () => {
  if (!client) {
    try {
      client = new MongoClient(MONGODB_URI!);
      await client.connect();
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error; // Rethrow the error to indicate connection failure
    }
  }

  return client;
};

export default connectDB;