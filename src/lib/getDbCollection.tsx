import connectDb from './connectDb';

const MONGODB_DB = process.env.MONGODB_DB

const getDbCollection = async (collectionName: string) => {
  const client = await connectDb();
  try {
    const database = client.db(MONGODB_DB);
    const collection = database.collection(collectionName);
    return collection;
  } catch (error) {
    return null
  }
};

export default getDbCollection;
