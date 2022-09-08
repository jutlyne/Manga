import * as mongoDB from 'mongodb';
import { collections } from '..';
import 'dotenv/config';

export async function connectToDatabase () {
  const DB_CONN_STRING: any = process.env.DB_CONN_STRING;
  const MANGA_COLLECTION_NAME: any = process.env.MANGA_COLLECTION_NAME;

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);

  await client.connect();
  const db: mongoDB.Db = client.db(process.env.DB_NAME);
  const mangaCollection: mongoDB.Collection = db.collection(MANGA_COLLECTION_NAME);

  collections.manga = mangaCollection;
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${mangaCollection.collectionName}`);
}
