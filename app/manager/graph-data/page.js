'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Container, Typography, Paper, Box, Grid,
  FormControl, InputLabel, Select, MenuItem,
  Button, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

export default function GraphPage() {
  const salesChartRef = useRef(null);
  const ordersChartRef = useRef(null);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [salesChart, setSalesChart] = useState(null);
  const [ordersChart, setOrdersChart] = useState(null);
  const [stats, setStats] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Check if user is manager
    const role = localStorage.getItem('userRole');
    if (role !== 'manager') {
      router.push('/');
      return;
    }

    fetchData();
  }, [router, timeRange]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/orders/stats');
      const data = await response.json();

      // Process data based on time range
      let chartData;

      if (timeRange === 'week') {
        chartData = {
          labels: data.labels.slice(0, 7),
          sales: data.sales.slice(0, 7),
          orders: data.orders.slice(0, 7)
        };
      } else if (timeRange === 'month') {
        chartData = {
          labels: data.labels.slice(0, 30),
          sales: data.sales.slice(0, 30),
          orders: data.orders.slice(0, 30)
        };
      } else {
        chartData = data;
      }

      setStats({
        totalSales: chartData.sales.reduce((a, b) => a + b, 0),
        totalOrders: chartData.orders.reduce((a, b) => a + b, 0),
        averageSale: chartData.sales.reduce((a, b) => a + b, 0) / chartData.sales.length,
        maxSales: Math.max(...chartData.sales)
      });

      createCharts(chartData);
    } catch (error) {
      console.error('Error loading graph data:', error);
      // Use sample data if API fails
      useSampleData();
    } finally {
      setLoading(false);
    }
  };

  const useSampleData = () => {
    const sampleData = getSampleData(timeRange);
    setStats({
      totalSales: sampleData.sales.reduce((a, b) => a + b, 0),
      totalOrders: sampleData.orders.reduce((a, b) => a + b, 0),
      averageSale: sampleData.sales.reduce((a, b) => a + b, 0) / sampleData.sales.length,
      maxSales: Math.max(...sampleData.sales)
    });
    createCharts(sampleData);
  };

  const getSampleData = (range) => {
    if (range === 'week') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sales: [450, 520, 480, 620, 580, 720, 680],
        orders: [45, 52, 48, 62, 58, 72, 68]
      };
    } else if (range === 'month') {
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        sales: [2800, 3200, 2900, 3500],
        orders: [280, 320, 290, 350]
      };
    } else {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        sales: [12000, 13500, 14200, 13800, 15500, 16200, 15800, 16500, 17000, 16800, 17500, 18500],
        orders: [1200, 1350, 1420, 1380, 1550, 1620, 1580, 1650, 1700, 1680, 1750, 1850]
      };
    }
  };

  const createCharts = async (data) => {
    // Dynamically import Chart.js only on client side
    const Chart = (await import('chart.js/auto')).default;

    // Destroy existing charts
    if (salesChart) salesChart.destroy();
    if (ordersChart) ordersChart.destroy();

    // Create Sales Chart
    const salesCtx = salesChartRef.current.getContext('2d');
    const newSalesChart = new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Sales (€)',
          data: data.sales,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Sales Trend'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Sales (€)'
            }
          }
        }
      }
    });

    // Create Orders Chart
    const ordersCtx = ordersChartRef.current.getContext('2d');
    const newOrdersChart = new Chart(ordersCtx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Orders (#)',
          data: data.orders,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Order Volume'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Orders'
            }
          }
        }
      }
    });

    setSalesChart(newSalesChart);
    setOrdersChart(newOrdersChart);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleBack = () => {
    router.push('/manager');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          📊 Sales Analytics
        </Typography>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
            <MenuItem value="year">Last 12 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Total Sales
            </Typography>
            <Typography variant="h4" color="primary">
              €{stats.totalSales?.toLocaleString() || '0'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Total Orders
            </Typography>
            <Typography variant="h4" color="primary">
              {stats.totalOrders?.toLocaleString() || '0'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, text-align: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Average Sale
            </Typography>
            <Typography variant="h4" color="primary">
              €{stats.averageSale?.toFixed(0) || '0'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, text-align: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Peak Sales
            </Typography>
            <Typography variant="h4" color="primary">
              €{stats.maxSales?.toLocaleString() || '0'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <canvas ref={salesChartRef} height="300"></canvas>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <canvas ref={ordersChartRef} height="300"></canvas>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic' }}>
      </Typography>
    </Container>
  );
}
