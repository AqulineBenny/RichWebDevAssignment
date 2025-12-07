export async function GET(req) {
  console.log("in the putInCart api page");

  const { searchParams } = new URL(req.url);
  const pname = searchParams.get('pname');

  const userEmail = "sample@test.com";

  const { MongoClient } = require('mongodb');
  const url = process.env.MONGODB_URI;
  const client = new MongoClient(url);

  const dbName = 'app';

  await client.connect();
  console.log('Connected successfully to server');

  const db = client.db(dbName);
  const collection = db.collection('shopping_cart');

  const myobj = { pname: pname, username: userEmail, date: new Date() };
  const insertResult = await collection.insertOne(myobj);

  console.log('Inserted document:', insertResult.insertedId);

  await client.close();

  return Response.json({ "data": "inserted" });
}