'use client';
import { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Button, Box,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Alert, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useRouter } from 'next/navigation';

export default function ViewCartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/');
      return;
    }

    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    setLoading(false);
  }, [router]);

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (index, change) => {
    const newCart = [...cart];
    const item = { ...newCart[index] };

    if (!item.quantity) item.quantity = 1;
    item.quantity = Math.max(1, item.quantity + change);

    newCart[index] = item;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  };

  const deliveryFee = cart.length > 0 ? 2.50 : 0;
  const total = calculateSubtotal() + deliveryFee;

  if (loading) {
    return (
      <Container>
        <Typography>Loading cart...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/customer')}
        sx={{ mb: 3 }}
      >
        Back to Menu
      </Button>

      <Typography variant="h4" gutterBottom>
        🛒 Your Shopping Cart
      </Typography>

      {cart.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add some delicious items from our menu!
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/customer')}
          >
            Browse Menu
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Product</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Quantity</strong></TableCell>
                  <TableCell><strong>Subtotal</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">
                        €{(item.price || 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                          size="small"
                          onClick={() => updateQuantity(index, -1)}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          -
                        </Button>
                        <Typography sx={{ mx: 2 }}>
                          {item.quantity || 1}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => updateQuantity(index, 1)}
                        >
                          +
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color="primary">
                        €{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => removeItem(index)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Order Summary */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Button
                variant="outlined"
                color="error"
                onClick={clearCart}
                sx={{ mb: 2 }}
              >
                Clear Entire Cart
              </Button>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal ({cart.length} items)</Typography>
                    <Typography>€{calculateSubtotal().toFixed(2)}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Delivery Fee</Typography>
                    <Typography>€{deliveryFee.toFixed(2)}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '2px solid #ccc' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h5" color="primary">
                      €{total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<ShoppingCartCheckoutIcon />}
                  onClick={() => router.push('/checkout')}
                >
                  Proceed to Checkout
                </Button>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  Free delivery on orders over €20
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
