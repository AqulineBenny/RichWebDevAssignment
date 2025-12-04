export async function POST(request) {
  console.log("Cart Remove API called");

  try {
    const body = await request.json();
    const { cartItemId } = body;

    return Response.json({
      success: true,
      message: 'Item removed from cart',
      removedItemId: cartItemId
    });

  } catch (error) {
    console.error('Cart Remove API error:', error);
    return Response.json({ success: false, error: 'Failed to remove item' });
  }
}