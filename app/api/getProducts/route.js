import { MongoClient } from 'mongodb';

export async function GET() {
  console.log("Get Products API called");

  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db('mcdonalds');
    const products = db.collection('products');

    // Get all products
    const productList = await products.find({}).toArray();

    await client.close();

    // If no products in DB, return sample data
    if (productList.length === 0) {
      return Response.json([
        { id: 1, name: 'Big Mac', description: 'Two all-beef patties', price: 4.99, image: '/bigmac.jpg' },
        { id: 2, name: 'Cheeseburger', description: 'Beef patty with cheese', price: 2.99, image: '/cheeseburger.jpg' },
        { id: 3, name: 'French Fries', description: 'Golden crispy fries', price: 2.49, image: '/fries.jpg' },
        { id: 4, name: 'Coca-Cola', description: 'Large refreshing drink', price: 1.99, image: '/coke.jpg' },
        { id: 5, name: 'McFlurry', description: 'Ice cream with cookies', price: 3.49, image: '/mcflurry.jpg' },
      ]);
    }

    return Response.json(productList);

  } catch (error) {
    console.error('Get Products API error:', error);

    // Fallback sample data if DB fails
    return Response.json([
      { id: 1, name: 'Big Mac', description: 'Two all-beef patties', price: 4.99, image: '/bigmac.jpg' },
      { id: 2, name: 'Cheeseburger', description: 'Beef patty with cheese', price: 2.99, image: '/cheeseburger.jpg' },
      { id: 3, name: 'French Fries', description: 'Golden crispy fries', price: 2.49, image: '/fries.jpg' },
      { id: 4, name: 'Coca-Cola', description: 'Large refreshing drink', price: 1.99, image: '/coke.jpg' },
      { id: 5, name: 'McFlurry', description: 'Ice cream with cookies', price: 3.49, image: '/mcflurry.jpg' },
    ]);
  }
}