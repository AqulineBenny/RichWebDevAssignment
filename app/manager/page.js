'use client';
import { useState, useEffect } from 'react';
import {
  Container, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
  Box, Grid, Button, CircularProgress, Alert,
  AppBar, Toolbar, IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';

export default function ManagerPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, averageOrder: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is manager
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');

    if (!email || role !== 'manager') {
      router.push('/');
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data);
      calculateStats(data);
    } catch (err) {
      setError('Failed to load orders: ' + err.message);
      // Use sample data as fallback
      const sampleData = getSampleOrders();
      setOrders(sampleData);
      calculateStats(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orderList) => {
    const totalOrders = orderList.length;
    const totalRevenue = orderList.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    setStats({ totalOrders, totalRevenue, averageOrder });
  };

  const getSampleOrders = () => {
    return [
      { id: 'ORD-001', customer: 'john@email.com', items: ['Big Mac', 'Fries', 'Coke'], total: 12.97, date: '2024-01-15 14:30', status: 'completed' },
      { id: 'ORD-002', customer: 'sarah@email.com', items: ['Cheeseburger', 'McFlurry'], total: 8.98, date: '2024-01-15 15:45', status: 'completed' },
      { id: 'ORD-003', customer: 'mike@email.com', items: ['Big Mac x2', 'Nuggets', 'Fries x2'], total: 21.94, date: '2024-01-16 10:15', status: 'completed' },
      { id: 'ORD-004', customer: 'emma@email.com', items: ['Fries', 'Coke'], total: 5.48, date: '2024-01-16 12:30', status: 'completed' },
      { id: 'ORD-005', customer: 'david@email.com', items: ['Big Mac', 'Nuggets', 'McFlurry'], total: 17.46, date: '2024-01-16 18:20', status: 'completed' }
    ];
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            👨‍💼 Manager Dashboard
          </Typography>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={fetchOrders}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>

          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error} (Showing sample data)
          </Alert>
        )}

        <Typography variant="h4" gutterBottom>
          Sales Overview
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Total Orders
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.totalOrders}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h3" color="primary">
                €{stats.totalRevenue.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Average Order
              </Typography>
              <Typography variant="h3" color="primary">
                €{stats.averageOrder.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Orders Table */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Recent Orders
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Items</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>Date & Time</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id || order.orderId} hover>
                  <TableCell>{order.id || order.orderId}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {Array.isArray(order.items) ? order.items.join(', ') : order.items}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      €{order.total?.toFixed(2) || '0.00'}
                    </Typography>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Box sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: order.status === 'completed' ? 'success.light' : 'warning.light',
                      color: order.status === 'completed' ? 'success.dark' : 'warning.dark'
                    }}>
                      {order.status || 'pending'}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {orders.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No orders found.
          </Alert>
        )}
      </Container>
    </>
  );
}
