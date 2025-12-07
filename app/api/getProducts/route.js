export async function GET(req, res) {
    console.log("in the getProducts api page");

    const { MongoClient } = require('mongodb');
    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url);
    const urlObj = new URL(process.env.MONGODB_URI);
    const dbName = urlObj.pathname.replace('/', '') || 'app';

    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('products'); 
    const findResult = await collection.find({}).toArray();

    console.log('Found documents =>', findResult);
    return Response.json(findResult);
}
