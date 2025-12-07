'use client';
import { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, CardMedia,
  Button, Typography, Box, Alert, CircularProgress,
  AppBar, Toolbar, IconButton, Badge, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

export default function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [weather, setWeather] = useState({ temp: 15, description: 'Sunny' });
  const [loading, setLoading] = useState(true);
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get user info
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');

    if (!email || role !== 'customer') {
      router.push('/');
      return;
    }

    setUserEmail(email);

    // Load products
    fetchProducts();

    // Load weather
    fetchWeather();

    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);

    setLoading(false);
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/getProducts');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch('/api/weather');
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error loading weather:', error);
    }
  };

  const addToCart = (product) => {
    const newCart = [...cart, { ...product, cartId: Date.now() }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('cart');
    router.push('/');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0), 0);
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
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🍟 McDonald's Menu
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Typography variant="body2">
              🌤️ {weather.temp}°C, {weather.description}
            </Typography>
          </Box>

          <IconButton color="inherit" onClick={() => setCartDialogOpen(true)}>
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {userEmail}
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          Browse our delicious menu and add items to your cart
        </Typography>

        {products.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No products available at the moment.
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id || product._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        €{product.price?.toFixed(2) || '0.00'}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Cart Dialog */}
      <Dialog open={cartDialogOpen} onClose={() => setCartDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Shopping Cart ({cart.length} items)
        </DialogTitle>
        <DialogContent>
          {cart.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ py: 4 }}>
              Your cart is empty
            </Typography>
          ) : (
            <>
              {cart.map((item, index) => (
                <Box key={item.cartId || index} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography sx={{ flexGrow: 1 }}>
                    {item.name} - €{item.price?.toFixed(2)}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}

              <Box sx={{ mt: 3, pt: 2, borderTop: '2px solid #ccc' }}>
                <Typography variant="h6" align="right">
                  Total: €{calculateTotal().toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCartDialogOpen(false)}>Continue Shopping</Button>
          {cart.length > 0 && (
            <Button variant="contained" onClick={() => {
              setCartDialogOpen(false);
              router.push('/view_cart');
            }}>
              Go to Checkout
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
