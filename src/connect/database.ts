import * as mongoDB from 'mongodb';
import { collections } from '..';

export async function connectToDatabase () {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);

  await client.connect();
  const db: mongoDB.Db = client.db(process.env.DB_NAME);
  const mangaCollection: mongoDB.Collection = db.collection(process.env.MANGA_COLLECTION_NAME);

  collections.manga = mangaCollection;
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${mangaCollection.collectionName}`);
}
