import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export async function GET(req, res) {
    console.log("in the login api page");

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const pass = searchParams.get('pass');

    console.log("Login for:", email);

    if (!email || !pass) {
        return Response.json({ success: false, error: 'Email and password required' });
    }

    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db('app');
        const collection = db.collection('users');

        const user = await collection.findOne({ email: email });

        if (!user) {
            await client.close();
            return Response.json({ success: false, error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(pass, user.password);

        if (!passwordMatch) {
            await client.close();
            return Response.json({ success: false, error: 'Invalid password' });
        }

        await client.close();

        return Response.json({
            success: true,
            email: user.email,
            role: user.role,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Error:', error);
        return Response.json({ success: false, error: 'Server error' });
    }
}
