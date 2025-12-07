'use client';
import { useState } from 'react';
import {
  Container, TextField, Button, Box, Typography,
  Paper, Alert, CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/login?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(password)}`);
      const data = await response.json();

      if (data.success) {
        // Store user info in localStorage
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);

        // Redirect based on role
        if (data.role === 'manager') {
          router.push('/manager');
        } else {
          router.push('/customer');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          McDonald's Login
        </Typography>

        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Welcome to the McDonald's Ordering System
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => router.push('/register')}
              disabled={loading}
            >
              Register here
            </Button>
          </Typography>

        </Box>
      </Paper>
    </Container>
  );
}
