import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export async function GET(request) {
  console.log("Login API called");

  try {
    // Get parameters from URL
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const password = searchParams.get('pass');

    console.log("Login attempt for:", email);

    if (!email || !password) {
      return Response.json({ success: false, error: 'Email and password required' });
    }

    // Connect to MongoDB (using environment variable)
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db('mcdonalds');
    const users = db.collection('users');

    // Find user by email
    const user = await users.findOne({ email: email });

    if (!user) {
      await client.close();
      return Response.json({ success: false, error: 'User not found' });
    }

    // Compare password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      await client.close();
      return Response.json({ success: false, error: 'Invalid password' });
    }

    await client.close();

    // Return success with user role
    return Response.json({
      success: true,
      email: user.email,
      role: user.role,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login API error:', error);
    return Response.json({
      success: false,
      error: 'Server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}