import * as mongoDB from 'mongodb';
import { collections } from '..';
import 'dotenv/config';

export async function connectToDatabase () {
  const DB_CONN_STRING: any = process.env.DB_CONN_STRING;
  const MANGA_COLLECTION_NAME: any = process.env.MANGA_COLLECTION_NAME;
  const ALBUM_COLLECTION_NAME: any = process.env.ALBUM_COLLECTION_NAME;
  const USER_COLLECTION_NAME: any = process.env.USER_COLLECTION_NAME;

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);

  await client.connect();
  const db: mongoDB.Db = client.db(process.env.DB_NAME);
  const mangaCollection: mongoDB.Collection = db.collection(MANGA_COLLECTION_NAME);
  const albumImgurCollection: mongoDB.Collection = db.collection(ALBUM_COLLECTION_NAME);
  const userCollection: mongoDB.Collection = db.collection(USER_COLLECTION_NAME);

  collections.user = userCollection;
  collections.manga = mangaCollection;
  collections.albumImgur = albumImgurCollection;
  console.log(`Successfully connected to database: ${db.databaseName}`);
}
