export async function GET() {
  console.log("Orders Stats API called");

  // Return data for graph
  return Response.json({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    sales: [12000, 13500, 14200, 13800, 15500, 16200, 15800, 16500, 17000, 16800, 17500, 18500],
    orders: [1200, 1350, 1420, 1380, 1550, 1620, 1580, 1650, 1700, 1680, 1750, 1850]
  });
}
