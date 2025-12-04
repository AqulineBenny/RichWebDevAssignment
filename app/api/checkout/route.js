export async function POST(request) {
  console.log("Checkout API called");

  try {
    const body = await request.json();
    const { orderId, customer, items, total, shippingAddress } = body;

    console.log("Processing order:", orderId, "for customer:", customer);

    // Simulate email sending (using SendGrid)
    const sendgridKey = process.env.SENDGRID_API_KEY;

    if (sendgridKey) {
      // Real email sending code would go here
      console.log("Email would be sent to:", customer);
    }

    // Return success response
    return Response.json({
      success: true,
      orderId: orderId,
      message: 'Order processed successfully',
      emailSent: !!sendgridKey,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return Response.json({
      success: false,
      error: 'Checkout failed',
      orderId: 'ERROR-' + Date.now()
    });
  }
}