const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./infrastructure/database/mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const productRoutes = require('./api/routes/productRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const orderRoutes = require('./api/routes/orderRoutes');
const authRoutes = require('./api/routes/authRoutes');
const inventoryRoutes = require('./api/routes/inventoryRoutes');
const supplierRoutes = require('./api/routes/supplierRoutes');
const notificationRoutes = require('./api/routes/notificationRoutes');

// Seller routes (New modules)
const sellerDashboardRoutes = require('./modules/seller-dashboard/routes/dashboard.route');
const sellerProductRoutes = require('./modules/seller-dashboard/routes/product.route');
const sellerCustomerRoutes = require('./modules/seller-dashboard/routes/customer.route');
const sellerSourcingRoutes = require('./modules/seller-dashboard/routes/sourcing.route');
const sellerOrderRoutes = require('./modules/seller-dashboard/routes/order.route');
const sellerReportRoutes = require('./modules/seller-dashboard/routes/report.route');
const adminDashboardRoutes = require('./modules/admin-dashboard/routes/admin.route');
const adminUserRoutes = require('./modules/admin-dashboard/routes/user.route');
const productApprovalRoutes = require('./modules/admin-dashboard/routes/product.route'); // Renamed from adminProductRoutes
const kycRoutes = require('./modules/admin-dashboard/routes/kyc.route'); // Renamed from adminKYCRoutes
const adminInventoryRoutes = require('./modules/admin-dashboard/routes/inventory.route');
const disputeRoutes = require('./modules/admin-dashboard/routes/dispute.route'); // Added dispute routes
// Seller routes (Legacy module, will handle what isn't caught above)
const sellerRoutes = require('./api/routes/sellerRoutes');

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// Prioritize new standalone module routes for sellers
app.use('/api/seller/dashboard', sellerDashboardRoutes);
app.use('/api/seller/products', sellerProductRoutes);
app.use('/api/seller/customers', sellerCustomerRoutes);
app.use('/api/seller/sourcing', sellerSourcingRoutes);
app.use('/api/seller/orders', sellerOrderRoutes);
app.use('/api/seller/reports', sellerReportRoutes);
// Fallback to legacy seller routes
app.use('/api/seller', sellerRoutes);

app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);

// Admin routes
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/products', productApprovalRoutes);
app.use('/api/admin/kyc', kycRoutes);
app.use('/api/admin/inventory', adminInventoryRoutes);
app.use('/api/admin/disputes', disputeRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Project LK API' });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

const startServer = async () => {
  try {
    console.log('Starting server...');
    // Await database connection before starting the server
    await connectDB(); 
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
