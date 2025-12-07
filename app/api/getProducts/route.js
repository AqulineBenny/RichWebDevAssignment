export async function GET(req, res) {
    // Make a note we are on the api. This goes to the console.
    console.log("in the getProducts api page");

    // ==============================
    // Database connection - EXACTLY as shown in Lecture 3, page 61 / Task 4
    const { MongoClient } = require('mongodb');

    // Use your MongoDB Atlas connection string from .env.local
    const url = process.env.MONGODB_URI;

    const client = new MongoClient(url);

    // Extract database name from connection string (Task 4 method)
    const urlObj = new URL(process.env.MONGODB_URI);
    const dbName = urlObj.pathname.replace('/', '') || 'app';

    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('products'); // collection name

    // Find all products - simple empty query {} means "get all"
    const findResult = await collection.find({}).toArray();

    console.log('Found documents =>', findResult);
    // ==============================

    // At the end of the process we need to send something back.
    // Return the array directly as shown in Task 4 (page 24)
    return Response.json(findResult);
}
