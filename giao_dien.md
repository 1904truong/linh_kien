Dưới góc độ là một BA, để thiết kế (vẽ Wireframe/UI) cho hệ thống này một cách hoàn chỉnh, bạn cần khoảng **25 - 35 màn hình chính** (chưa tính các states nhỏ hoặc popup).

Dưới đây là bảng phân bổ các trang cần thiết theo từng vai trò:

### 1. Phân hệ Khách hàng (Customer Site - ~8-10 trang)
Đây là bộ mặt của sàn, tập trung vào trải nghiệm mua sắm và tìm kiếm chính xác linh kiện.
*   **Trang chủ:** Banner, danh mục linh kiện theo dòng xe, sản phẩm gợi ý.
*   **Trang Tìm kiếm & Lọc:** Bộ lọc nâng cao (theo hãng xe, đời xe, mã OEM).
*   **Trang Chi tiết sản phẩm:** Thông tin kỹ thuật, bảng tương thích (xe nào dùng được), đánh giá.
*   **Trang Giỏ hàng:** Quản lý sản phẩm từ nhiều shop.
*   **Trang Thanh toán (Checkout):** Chọn phương thức thanh toán, địa chỉ.
*   **Trang Quản lý đơn hàng:** Danh sách đơn, trạng thái vận chuyển.
*   **Trang Hồ sơ & Gara của tôi:** Nơi lưu thông tin xe của khách để hệ thống tự gợi ý linh kiện phù hợp.
*   **Trang Trung tâm trợ giúp/Khiếu nại:** Xử lý sau bán hàng.

### 2. Phân hệ Người bán (Seller Dashboard - ~6-8 trang)
Tập trung vào vận hành và kết nối nguồn hàng.
*   **Tổng quan (Dashboard):** Thống kê doanh thu, đơn hàng mới, cảnh báo tồn kho.
*   **Quản lý sản phẩm:** Danh sách SP đang bán, trạng thái duyệt.
*   **Đăng sản phẩm:** Form đăng bài (tự đăng hoặc link từ Supplier).
*   **Quản lý Nguồn hàng (Sourcing):** Tìm kiếm sản phẩm từ Supplier, kết nối kho sỉ.
*   **Quản lý đơn hàng:** Danh sách đơn từ khách, xác nhận, in vận đơn.
*   **Cài đặt Gian hàng:** Thông tin shop, chính sách đổi trả.

### 3. Phân hệ Nhà cung cấp (Supplier Dashboard - ~4-5 trang)
Đơn giản hơn Seller, tập trung vào kho sỉ và giá.
*   **Quản lý Danh mục sỉ:** Đăng tải linh kiện số lượng lớn, cập nhật mã OEM.
*   **Quản lý Tồn kho & Giá sỉ:** Cập nhật bảng giá cho Seller.
*   **Quản lý Đơn nhập:** Xử lý các đơn hàng sỉ từ Seller hoặc đơn Dropship.
*   **Thống kê đại lý:** Xem bao nhiêu Seller đang lấy hàng của mình.

### 4. Phân hệ Quản trị (Admin Portal - ~6-8 trang)
Dành cho đơn vị vận hành sàn (Platform Owner).
*   **Quản trị Người dùng:** Duyệt hồ sơ Seller/Supplier (KYC).
*   **Quản lý Sản phẩm:** Duyệt sản phẩm mới, kiểm soát hàng giả.
*   **Quản lý Giao dịch & Tài chính:** Đối soát tiền (Escrow), phí sàn.
*   **Quản lý Tranh chấp:** Tiếp nhận và xử lý khiếu nại giữa Khách và Shop.
*   **Cấu hình hệ thống:** Quản lý danh mục xe (Master Data), mã lỗi, phí vận chuyển.

### 5. Các trang chung (Common Pages - ~3-5 trang)
*   **Đăng nhập / Đăng ký / Quên mật khẩu.**
*   **Trang thông báo (Notification Center).**
*   **Trang 404 / Thành công / Thất bại.**

---

**Lời khuyên từ BA:**
*   **Giai đoạn 1 (MVP):** Bạn chỉ nên tập trung vào khoảng **15 trang cốt lõi** (Luồng mua hàng chuẩn và Luồng đăng hàng từ Supplier).
*   **Điểm nhấn:** Trong ngành linh kiện ô tô, trang **Chi tiết sản phẩm** và **Bộ lọc tìm kiếm theo xe** là quan trọng nhất. Nếu làm không kỹ phần này, tỷ lệ khách mua nhầm hàng dẫn đến đổi trả sẽ rất cao.