'use client';
import { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Button, Box,
  TextField, Grid, Alert, Stepper, Step,
  StepLabel, CircularProgress, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';

const steps = ['Cart Review', 'Delivery Details', 'Payment', 'Confirmation'];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Dublin',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    notes: ''
  });
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/');
      return;
    }

    // Load cart
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);

    // Pre-fill form
    setFormData(prev => ({
      ...prev,
      email: email,
      fullName: email.split('@')[0] || ''
    }));
  }, [router]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
    return subtotal + (cart.length > 0 ? 2.50 : 0);
  };

  const handleNext = () => {
    if (activeStep === 0 && cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (activeStep === 1) {
      // Validate delivery details
      if (!formData.fullName || !formData.address || !formData.phone) {
        alert('Please fill in all required delivery details');
        return;
      }
    }

    if (activeStep === 2) {
      // Validate payment
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        alert('Please fill in all payment details');
        return;
      }
    }

    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderData = {
        orderId: 'MC' + Date.now(),
        customer: formData.email,
        customerName: formData.fullName,
        items: cart,
        total: calculateTotal(),
        deliveryAddress: `${formData.address}, ${formData.city} ${formData.zipCode}`,
        phone: formData.phone,
        notes: formData.notes,
        date: new Date().toISOString()
      };

      // Save order to localStorage (simulating database)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, orderData]));

      // Call checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setOrderId(orderData.orderId);
        setOrderComplete(true);
        localStorage.removeItem('cart'); // Clear cart
        setActiveStep(3);
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="primary">
          Order Confirmed! 🎉
        </Typography>
        <Typography variant="h6" gutterBottom>
          Order ID: {orderId}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Thank you for your order. A confirmation email has been sent to {formData.email}
        </Typography>
        <Button variant="contained" onClick={() => router.push('/customer')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/view_cart')}
        sx={{ mb: 3 }}
      >
        Back to Cart
      </Button>

      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 0: Cart Review */}
      {activeStep === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Review Your Order
          </Typography>

          {cart.length === 0 ? (
            <Alert severity="warning">
              Your cart is empty. Please add items before checkout.
            </Alert>
          ) : (
            <>
              {cart.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, p: 1 }}>
                  <Typography>
                    {item.quantity || 1} x {item.name}
                  </Typography>
                  <Typography>
                    €{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h5" color="primary">
                  €{calculateTotal().toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      )}

      {/* Step 1: Delivery Details */}
      {activeStep === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Delivery Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Notes (Optional)"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={2}
                placeholder="E.g., Leave at door, ring bell, etc."
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Step 2: Payment */}
      {activeStep === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            ⚠️ This is a demo. No real payment will be processed.
          </Alert>
        </Paper>
      )}

      {/* Step 3: Confirmation */}
      {activeStep === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography><strong>Customer:</strong> {formData.fullName}</Typography>
            <Typography><strong>Email:</strong> {formData.email}</Typography>
            <Typography><strong>Delivery:</strong> {formData.address}, {formData.city}</Typography>
            <Typography><strong>Total:</strong> €{calculateTotal().toFixed(2)}</Typography>
          </Box>

          <Alert severity="success" sx={{ mb: 2 }}>
            Ready to place your order? Click "Place Order" to complete.
          </Alert>
        </Paper>
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handlePlaceOrder}
            disabled={loading || cart.length === 0}
          >
            {loading ? <CircularProgress size={24} /> : 'Place Order'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={cart.length === 0}
          >
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
}
