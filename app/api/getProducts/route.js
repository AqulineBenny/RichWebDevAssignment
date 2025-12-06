export async function GET(req, res) {
    console.log("in the getProducts api page");

    const { MongoClient } = require('mongodb');
    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db('app');
        const collection = db.collection('products');

        const products = await collection.find({}).toArray();

        await client.close();

        if (products.length > 0) {
            // If database has products, return them
            return Response.json(products);
        } else {
            // Return sample data with free stock images
            return Response.json([
                {
                    "_id": "1",
                    "name": "Big Mac",
                    "description": "Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun",
                    "price": 4.99,
                    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
                    "category": "Burgers"
                },
                {
                    "_id": "2",
                    "name": "Cheeseburger",
                    "description": "100% Irish beef patty with a slice of cheese, pickles, mustard, and ketchup",
                    "price": 2.99,
                    "image": "https://images.unsplash.com/photo-1553979459-d2229ba7433d?w=400&h=300&fit=crop",
                    "category": "Burgers"
                },
                {
                    "_id": "3",
                    "name": "French Fries",
                    "description": "World famous fries, crispy and golden outside, fluffy inside",
                    "price": 2.49,
                    "image": "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop",
                    "category": "Sides"
                },
                {
                    "_id": "4",
                    "name": "Coca-Cola",
                    "description": "Large refreshing Coca-Cola with ice",
                    "price": 1.99,
                    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop",
                    "category": "Drinks"
                },
                {
                    "_id": "5",
                    "name": "McFlurry",
                    "description": "Creamy vanilla soft serve with Oreo cookie pieces mixed in",
                    "price": 3.49,
                    "image": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop",
                    "category": "Desserts"
                }
            ]);
        }

    } catch (error) {
        console.error('Error:', error);
        // Return sample data even on error
        return Response.json([
            {
                "name": "Big Mac",
                "description": "Sample product - Two all-beef patties",
                "price": 4.99,
                "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
            }
        ]);
    }
}
