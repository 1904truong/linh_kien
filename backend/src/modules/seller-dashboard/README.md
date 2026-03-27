# Hướng dẫn sử dụng Seller Dashboard Module

Module này được thiết kế để cung cấp dữ liệu thống kê nhanh cho người bán (Seller). Dưới đây là các bước để triển khai và sử dụng.

## 1. Cấu hình môi trường (.env)
Tạo tệp `.env` dựa trên `.env.example`:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/project_lk
JWT_SECRET=your_super_secret_key_here
```

## 2. Cấu trúc Token Authentication
Middleware `auth.js` yêu cầu Token JWT phải chứa trường `shopId`. 

**Ví dụ mã nguồn tạo Token (trong Auth Service của bạn):**
```javascript
const token = jwt.sign(
  { 
    userId: user._id, 
    shopId: user.shopId, // Quan trọng: Phải có shopId
    role: 'seller' 
  }, 
  process.env.JWT_SECRET
);
```

## 3. Gọi API Dashboard & Quản lý Sản phẩm
Sử dụng Header `Authorization: Bearer <token>` để gọi các API.

### Dashboard API
- **Endpoint**: `GET /api/seller/dashboard`
- **Kết quả trả về**:
```json
{
  "success": true,
  "data": {
    "ordersToday": 15,
    "revenueToday": 1500000,
    "lowStockCount": 3,
    "pendingProducts": 2,
    "recentOrders": [...],
    "lowStockProducts": [...]
  }
}
```

### Product Management API
- **Lấy danh sách sản phẩm**: `GET /api/seller/products?page=1&limit=10&search=keyword&status=active`
  - Kết quả trả về gồm: `products`, `total`, `page`, `totalPages`.
- **Thêm sản phẩm mới**: `POST /api/seller/products`
- **Cập nhật sản phẩm**: `PUT /api/seller/products/:id`
- **Xóa sản phẩm**: `DELETE /api/seller/products/:id`
- **Cập nhật kho nhanh**: `PATCH /api/seller/products/:id/stock`
  - Body: `{ "stock": 50 }`

## 4. Cách tích hợp vào dự án chính
Nếu bạn không muốn chạy độc lập, bạn có thể import router vào App chính của dự án Project_LK:

```javascript
// Trong tệp server chính của bạn
const dashboardRoutes = require('./src/modules/seller-dashboard/routes/dashboard.route');

app.use('/api/seller/dashboard', dashboardRoutes);
```

## 5. Dữ liệu mẫu (Seed Data)
Để Dashboard có dữ liệu, hãy đảm bảo các bản ghi trong MongoDB có `shopId` khớp với `shopId` trong Token của bạn.
- **Product**: Phải có `stock <= lowStockThreshold` để hiện cảnh báo.
- **Order**: Phải có `status: 'completed'` và `createdAt` là ngày hôm nay để tính doanh thu.
