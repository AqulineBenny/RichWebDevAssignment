import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export async function POST(request) {
    console.log("in the register api page");
    
    try {
        const body = await request.json();
        const { email, password, firstName, lastName } = body;
        
        console.log("Register for:", email);
        
        if (!email || !password || !firstName || !lastName) {
            return Response.json({ success: false, error: 'All fields required' });
        }
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const url = process.env.MONGODB_URI;
        const client = new MongoClient(url);
        
        await client.connect();
        
        const db = client.db('app');
        const collection = db.collection('users');
        
        const existingUser = await collection.findOne({ email: email });
        if (existingUser) {
            await client.close();
            return Response.json({ success: false, error: 'Email already registered' });
        }
        
        const newUser = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: 'customer',
            createdAt: new Date()
        };
        
        await collection.insertOne(newUser);
        
        await client.close();
        
        return Response.json({
            success: true,
            message: 'Registration successful'
        });
        
    } catch (error) {
        console.error('Error:', error);
        return Response.json({ success: false, error: 'Registration failed' });
    }
}
