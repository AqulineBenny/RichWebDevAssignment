import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export async function POST(request) {
  console.log("Register API called");

  try {
    // Get data from request body
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    console.log("Registration for:", email);

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return Response.json({ success: false, error: 'All fields required' });
    }

    if (password.length < 6) {
      return Response.json({ success: false, error: 'Password must be at least 6 characters' });
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db('mcdonalds');
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: email });
    if (existingUser) {
      await client.close();
      return Response.json({ success: false, error: 'Email already registered' });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user (default as customer)
    const newUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || '',
      role: 'customer', // Default role
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await users.insertOne(newUser);

    await client.close();

    console.log("User registered successfully:", result.insertedId);

    return Response.json({
      success: true,
      message: 'Registration successful',
      userId: result.insertedId
    });

  } catch (error) {
    console.error('Register API error:', error);
    return Response.json({
      success: false,
      error: 'Registration failed',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}