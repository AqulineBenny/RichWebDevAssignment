export async function GET(request) {
  console.log("Cart Get API called");

  // For now, return sample cart data
  // In real app, you'd get from database based on user session
  return Response.json([
    { id: 1, name: 'Big Mac', price: 4.99, quantity: 1 },
    { id: 3, name: 'French Fries', price: 2.49, quantity: 2 },
    { id: 4, name: 'Coca-Cola', price: 1.99, quantity: 1 }
  ]);
}