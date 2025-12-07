export async function POST(request) {
    console.log("Checkout API called");

    try {
        const body = await request.json();
        const { orderId, customer, items, total } = body;

        console.log("Processing order:", orderId, "for:", customer);

        const { MongoClient } = require('mongodb');
        const url = process.env.MONGODB_URI;
        const client = new MongoClient(url);

        await client.connect();

        const db = client.db('app');
        const ordersCollection = db.collection('orders');

        const order = {
            orderId: orderId,
            customer: customer,
            items: items,
            total: total,
            date: new Date().toISOString(),
            status: 'completed'
        };

        await ordersCollection.insertOne(order);
        await client.close();

        console.log("Order saved to database");

        return Response.json({
            success: true,
            orderId: orderId,
            message: 'Order processed successfully'
        });

    } catch (error) {
        console.error('Error:', error);
        return Response.json({
            success: false,
            error: 'Checkout failed'
        });
    }
}
