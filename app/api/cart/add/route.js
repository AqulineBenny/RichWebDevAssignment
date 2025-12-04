export async function POST(request) {
  console.log("Cart Add API called");

  try {
    const body = await request.json();
    const { productId, productName, price, email } = body;

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

