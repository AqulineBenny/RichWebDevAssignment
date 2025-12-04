export async function POST(request) {
  console.log("Cart Add API called");

  try {
    const body = await request.json();
    const { productId, productName, price, email } = body;

    // For now, just return success
    // In real app, you'd save to database
    return Response.json({
      success: true,
      message: 'Product added to cart',
      cartItem: {
        productId,
        productName,
        price,
        addedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Cart Add API error:', error);
    return Response.json({ success: false, error: 'Failed to add to cart' });
  }
}
