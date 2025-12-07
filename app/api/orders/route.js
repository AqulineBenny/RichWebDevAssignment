export async function GET() {
    console.log("in the orders api page");

    const { MongoClient } = require('mongodb');
    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db('app');
        const collection = db.collection('orders');

        const orders = await collection.find({}).sort({ date: -1 }).toArray();

        await client.close();

        if (orders.length > 0) {
            return Response.json(orders);
        } else {
            return Response.json([
                {
                    "orderId": "MC001",
                    "customer": "john@email.com",
                    "items": ["Big Mac", "Fries", "Coke"],
                    "total": 12.97,
                    "date": "2024-01-15 14:30",
                    "status": "completed"
                },
                {
                    "orderId": "MC002",
                    "customer": "sarah@email.com",
                    "items": ["Cheeseburger", "McFlurry"],
                    "total": 8.98,
                    "date": "2024-01-15 15:45",
                    "status": "completed"
                }
            ]);
        }

    } catch (error) {
        console.error('Error:', error);
        return Response.json([
            {
                "orderId": "SAMPLE001",
                "customer": "demo@email.com",
                "items": ["Big Mac"],
                "total": 4.99,
                "date": "2024-01-16 12:00",
                "status": "completed"
            }
        ]);
    }
}
