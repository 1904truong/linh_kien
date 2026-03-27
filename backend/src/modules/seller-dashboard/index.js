require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const dashboardRoutes = require('./routes/dashboard.route');
const productRoutes = require('./routes/product.route');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/seller/dashboard', dashboardRoutes);
app.use('/api/seller/products', productRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Seller Dashboard Server running on port ${PORT}`);
});
