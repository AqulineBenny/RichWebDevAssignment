export async function GET() {
  console.log("Orders API called");

  // Return sample orders for manager dashboard
  return Response.json([
    {
      id: 'ORD-001',
      customer: 'john@email.com',
      items: ['Big Mac', 'Fries', 'Coke'],
      total: 12.97,
      date: '2024-01-15 14:30',
      status: 'completed'
    },
    {
      id: 'ORD-002',
      customer: 'sarah@email.com',
      items: ['Cheeseburger', 'McFlurry'],
      total: 8.98,
      date: '2024-01-15 15:45',
      status: 'completed'
    },
    {
      id: 'ORD-003',
      customer: 'mike@email.com',
      items: ['Big Mac x2', 'Nuggets', 'Fries x2'],
      total: 21.94,
      date: '2024-01-16 10:15',
      status: 'completed'
    },
    {
      id: 'ORD-004',
      customer: 'emma@email.com',
      items: ['Fries', 'Coke'],
      total: 5.48,
      date: '2024-01-16 12:30',
      status: 'completed'
    },
    {
      id: 'ORD-005',
      customer: 'david@email.com',
      items: ['Big Mac', 'Nuggets', 'McFlurry'],
      total: 17.46,
      date: '2024-01-16 18:20',
      status: 'completed'
    }
  ]);
}