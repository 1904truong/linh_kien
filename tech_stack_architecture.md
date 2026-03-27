# Kiến trúc Kỹ thuật (Technical Architecture) - Stack: Next.js, Express, MongoDB

Với yêu cầu sử dụng **Clean Architecture** và cấu trúc thư mục mở rộng (Scalable), tôi đề xuất thiết kế như sau:

---

### 1. Cấu trúc thư mục (Folder Structure)

#### 1.1. Backend (Node.js + Express + MongoDB)
Áp dụng **Clean Architecture** để tách biệt Business Logic khỏi Framework.

```text
backend/
├── src/
│   ├── api/                # Express routes & controllers (Interface Adapter)
│   │   ├── controllers/
│   │   └── routes/
│   ├── core/               # Business Logic (Entities & Use Cases)
│   │   ├── entities/       # Domain objects
│   │   └── use-cases/      # Nghiệp vụ cụ thể (vd: PlaceOrder.js)
│   ├── infrastructure/     # Frameworks & Tools (Database, External APIs)
│   │   ├── database/       # MongoDB models & schemas
│   │   ├── repositories/   # Cài đặt cụ thể của Data Access (vd: MongooseRepository)
│   │   └── services/       # Email, SMS, Payment gateway integration
│   ├── shared/             # Middlewares, Utils, Constants
│   └── app.js              # Entry point
└── tests/                  # Unit & Integration tests
```

#### 1.2. Frontend (Next.js - App Router)
Áp dụng cấu trúc **Feature-based** để dễ quản lý khi hệ thống lớn dần.

```text
frontend/
├── src/
│   ├── app/                # Next.js App Router (Routes & Layouts)
│   ├── components/         # UI Components (Shared)
│   ├── features/           # Các module độc lập (vd: Auth, Cart, Product)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/       # API calls
│   │   └── store.js        # Zustand/Redux slice cụ thể
│   ├── hooks/              # Custom hooks dùng chung
│   ├── store/              # Global state (Redux Toolkit / Zustand)
│   ├── lib/                # Configuration (axios, utils, tailwind variants)
│   └── styles/             # Global CSS (Tailwind)
```

---

### 2. Thiết kế Database (MongoDB - NoSQL)

Vì sử dụng MongoDB, chúng ta sẽ tối ưu theo hướng **Document-based**, ưu tiên tốc độ đọc (Read-heavy).

#### 2.1. Collection: `users`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "role": ["customer", "seller", "supplier", "admin"],
  "garage": [
    { "carModelId": "ObjectId", "licensePlate": "string" }
  ],
  "address": { "street": "string", "city": "string" }
}
```

#### 2.2. Collection: `products`
*Lưu ý: Embed thông tin tương thích trực tiếp để tìm kiếm nhanh.*
```json
{
  "_id": "ObjectId",
  "name": "string",
  "oemCode": "string",
  "price": "number",
  "sellerId": "ObjectId",
  "compatibility": ["ObjectId"], // List of CarModel IDs
  "specs": { "material": "string", "size": "string" },
  "inventory": 100,
  "isApproved": true
}
```

#### 2.3. Collection: `orders`
```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId",
  "items": [
    { "productId": "ObjectId", "qty": 2, "price": 500 }
  ],
  "totalAmount": 1000,
  "status": "pending",
  "payment": { "method": "vnpay", "status": "unpaid" },
  "shipping": { "code": "string", "fee": 50 }
}
```

---

### 3. Luồng dữ liệu (Flow)

1.  **Request:** Frontend (Next.js) gọi API qua Axios sử dụng **Zustand/Redux** để quản lý trạng thái chờ.
2.  **Controller:** Express nhận request, validate dữ liệu đầu vào (Sử dụng Joi hoặc Zod).
3.  **Use Case:** Controller gọi Service/Use Case xử lý nghiệp vụ. **Clean Architecture** đảm bảo Use Case này không quan tâm database là gì.
4.  **Repository:** Use Case gọi Repository để tương tác với **MongoDB Atlas** thông qua Mongoose.
5.  **Response:** Kết quả trả ngược lại Frontend, Zustand cập nhật Global State và UI re-render.

### 4. Ưu điểm của cấu trúc này
*   **Scalability:** Dễ dàng tách các phân hệ (Seller, Customer) thành Microservices sau này.
*   **Testability:** Có thể viết Unit Test cho Use Case mà không cần Mock Database phức tạp.
*   **Maintainability:** Mỗi thành phần có một nhiệm vụ riêng biệt (Single Responsibility).
