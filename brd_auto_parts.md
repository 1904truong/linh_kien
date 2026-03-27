# Business Requirement Document (BRD)
## Hệ Thống Sàn Thương Mại Điện Tử Linh Kiện Ô Tô (Auto Parts Marketplace)

---

### 1. Tổng quan hệ thống (System Overview)

*   **Mục đích hệ thống:** Xây dựng một nền tảng thương mại điện tử chuyên biệt cho lĩnh vực linh kiện, phụ tùng ô tô. Kết nối trực tiếp giữa nhà cung cấp (Supplier), người bán lẻ (Seller) và khách hàng cuối (Customer). Hệ thống hỗ trợ cả mô hình bán hàng truyền thống và mô hình hỗ trợ nguồn hàng (dropshipping/sourcing).
*   **Đối tượng người dùng:**
    *   Chủ sở hữu xe ô tô cá nhân.
    *   Các gara sửa chữa, xưởng dịch vụ.
    *   Các cửa hàng kinh doanh phụ tùng.
    *   Các nhà phân phối, nhà sản xuất linh kiện.
*   **Phạm vi:** Hệ thống bao gồm Web ứng dụng cho khách hàng, cổng quản lý cho Seller/Supplier và Dashboard quản trị cho Admin.

---

### 2. Các vai trò (Roles)

| Vai trò | Mô tả | Mục tiêu sử dụng |
| :--- | :--- | :--- |
| **Khách hàng (Customer)** | Cá nhân hoặc tổ chức có nhu cầu mua linh kiện. | Tìm kiếm, so sánh giá, đặt hàng và theo dõi đơn hàng sửa chữa. |
| **Người bán (Seller)** | Đối tác kinh doanh trực tiếp trên sàn. | Đăng bán sản phẩm, quản lý gian hàng và xử lý đơn hàng cho khách. |
| **Nhà cung cấp (Supplier)** | Đơn vị sở hữu nguồn hàng sỉ/số lượng lớn. | Cung cấp danh mục hàng hóa, giá sỉ cho Seller hoặc hệ thống. Không bán lẻ trực tiếp. |
| **Quản trị viên (Admin)** | Nhân sự vận hành của sàn thương mại. | Điều phối hoạt động, duyệt người dùng/sản phẩm, xử lý tranh chấp và thống kê. |

---

### 3. Phân quyền (Authorization)

#### 3.1. Bảng phân quyền chi tiết (Role vs Function)

| Chức năng | Customer | Seller | Supplier | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Xem sản phẩm / Tìm kiếm | X | X | X | X |
| Đặt hàng (Mua lẻ) | X | | | |
| Quản lý gian hàng (Shop) | | X | | |
| Đăng sản phẩm bán lẻ | | X | | X |
| Đăng sản phẩm nguồn (Sỉ) | | | X | X |
| Quản lý nguồn hàng nhập | | X | | |
| Xử lý đơn hàng khách | | X | | |
| Xử lý đơn hàng sỉ (từ Seller)| | | X | |
| Quản trị hệ thống/User | | | | X |
| Thống kê doanh thu | | X | X | X |

#### 3.2. Phân biệt Seller và Supplier
*   **Seller:** Là thực thể trực tiếp tương tác với Customer. Seller có thể có kho riêng hoặc không. Nếu không có kho, Seller sẽ thực hiện "nhập hàng" ảo hoặc thực tế từ Supplier để bán lại.
*   **Supplier:** Đóng vai trò là "kho tổng". Họ cung cấp thông tin sản phẩm, tồn kho và giá sỉ. Supplier không xuất hiện trước Customer mà chỉ xuất hiện trong giao diện quản lý nguồn hàng của Seller.

---

### 4. Chức năng chính (Modules)

#### 4.1. Quản lý tài khoản
*   **Mô tả:** Đăng ký, đăng nhập, quản lý thông tin cá nhân/doanh nghiệp.
*   **Actor:** Tất cả các vai trò.
*   **Input:** Thông tin định danh (Email, SĐT, CCCD/MST), Mật khẩu.
*   **Output:** Tài khoản hoạt động, Profile hoàn thiện.
*   **Pre-condition:** Email/SĐT chưa tồn tại trên hệ thống.
*   **Post-condition:** User được phân quyền tương ứng với vai trò đã chọn.

#### 4.2. Quản lý sản phẩm
*   **Mô tả:** Thêm, sửa, xóa, phân loại linh kiện (theo dòng xe, đời xe, mã phụ tùng).
*   **Actor:** Seller, Supplier, Admin.
*   **Input:** Tên SP, Mã OEM, Hình ảnh, Mô tả, Thông số kỹ thuật.
*   **Output:** Sản phẩm hiển thị trên sàn hoặc trong danh mục sỉ.
*   **Pre-condition:** Tài khoản đã được duyệt.
*   **Post-condition:** SP chờ Admin duyệt (nếu có quy định).

#### 4.3. Quản lý nguồn hàng (Supplier Module)
*   **Mô tả:** Cho phép Seller kết nối với Supplier để lấy thông tin sản phẩm và tồn kho.
*   **Actor:** Seller, Supplier.
*   **Input:** Yêu cầu kết nối, Đơn đặt hàng sỉ.
*   **Output:** Danh sách sản phẩm đã kết nối, Trạng thái nhập hàng.
*   **Pre-condition:** Supplier đã đăng tải danh mục sản phẩm sỉ.
*   **Post-condition:** Cập nhật giá bán lẻ dựa trên giá sỉ (theo quy tắc Markup).

#### 4.4. Giỏ hàng & Đặt hàng
*   **Mô tả:** Lưu trữ sản phẩm chọn mua, thiết lập thông tin nhận hàng.
*   **Actor:** Customer.
*   **Input:** Số lượng, Địa chỉ giao hàng, Ghi chú.
*   **Output:** Đơn hàng (Order) được khởi tạo.
*   **Pre-condition:** Sản phẩm còn hàng.
*   **Post-condition:** Trừ tồn kho tạm thời (hold stock).

#### 4.5. Thanh toán
*   **Mô tả:** Xử lý giao dịch qua ví điện tử, ngân hàng hoặc COD.
*   **Actor:** Customer.
*   **Input:** Phương thức thanh toán, Xác nhận OTP/Mã.
*   **Output:** Trạng thái giao dịch (Thành công/Thất bại).
*   **Pre-condition:** Đơn hàng hợp lệ.
*   **Post-condition:** Chuyển trạng thái đơn hàng sang "Đã thanh toán" hoặc "Chờ xác nhận".

#### 4.6. Quản lý đơn hàng
*   **Mô tả:** Theo dõi lộ trình đơn hàng từ lúc đặt đến lúc giao.
*   **Actor:** Customer, Seller, Supplier (nếu là đơn sỉ).
*   **Input:** Cập nhật trạng thái (Xác nhận, Đang giao, Đã giao).
*   **Output:** Lịch sử đơn hàng, Thông báo real-time.
*   **Pre-condition:** Đơn hàng đã được tạo.
*   **Post-condition:** Hoàn tất giao dịch hoặc kích hoạt quy trình đổi trả.

---

### 5. Luồng nghiệp vụ (Business Flow)

#### A. Luồng Khách hàng (Customer Flow):
1.  **Đăng ký/Đăng nhập:** Tạo tài khoản để lưu thông tin xe.
2.  **Tìm kiếm:** Theo tên linh kiện hoặc Mã phụ tùng (OEM).
3.  **Thêm giỏ hàng:** Lưu SP từ nhiều Seller khác nhau.
4.  **Đặt hàng & Thanh toán:** Chọn địa chỉ, phương thức thanh toán.
5.  **Theo dõi đơn:** Xem trạng thái từ "Xác nhận" đến "Đã giao".
6.  **Đánh giá:** Gửi feedback về chất lượng linh kiện và thời gian giao.

#### B. Luồng Người bán (Seller Flow):
1.  **Tạo shop:** Hoàn thiện hồ sơ gian hàng.
2.  **Đăng sản phẩm:** Đăng sản phẩm tự có hoặc "Link" sản phẩm từ Supplier.
3.  **Quản lý tồn kho:** Cập nhật số lượng thực tế.
4.  **Xử lý đơn:** Nhận thông báo -> Đóng gói -> Giao cho vận chuyển.

#### C. Luồng Nhà cung cấp (Supplier Flow):
1.  **Đăng sản phẩm nguồn:** Đăng hàng loạt danh mục sỉ.
2.  **Quản lý tồn kho/giá sỉ:** Cập nhật real-time để Seller điều chỉnh giá bán lẻ.
3.  **Xử lý đơn nhập:** Khi Seller có đơn (nếu theo mô hình Dropship), Supplier sẽ đóng gói và gửi đi.

#### D. Luồng Quản trị (Admin Flow):
1.  **Duyệt User/Shop:** Đảm bảo uy tín người bán.
2.  **Kiểm soát sản phẩm:** Gỡ bỏ hàng giả, hàng kém chất lượng.
3.  **Thống kê:** Theo dõi tăng trưởng, phí sàn và số lượng giao dịch.

---

### 6. Quy tắc nghiệp vụ (Business Rules)

*   **Quy tắc giá:**
    *   Giá bán lẻ (Retail Price) phải >= Giá sỉ (Wholesale Price) + Phí sàn + % Lợi nhuận kỳ vọng.
    *   Hệ thống có cơ chế cảnh báo nếu Seller đặt giá quá cao hoặc quá thấp so với sàn.
*   **Quy tắc tồn kho:**
    *   Nếu Supplier cập nhật hết hàng, các sản phẩm liên kết của Seller phải tự động chuyển về trạng thái "Hết hàng".
*   **Quy tắc hủy đơn:**
    *   Khách hàng có thể hủy đơn trước khi Seller nhấn "Xác nhận đơn hàng".
    *   Sau khi giao cho đơn vị vận chuyển, việc hủy đơn phải thông qua quy trình trả hàng/hoàn tiền.
*   **Thanh toán:**
    *   Tiền thanh toán của Khách sẽ được Sàn giữ (Escrow) và chỉ chuyển cho Seller sau khi đơn hàng thành công (qua thời gian khiếu nại).

---

### 7. Use Case (Actor – Use Case – Description)

| Actor | Use Case | Mô tả |
| :--- | :--- | :--- |
| **Customer** | UC01 - Search by OEM | Tìm linh kiện chính xác bằng mã số nhà sản xuất. |
| **Customer** | UC02 - Track Repair Order | Theo dõi tiến độ đơn hàng theo thời gian thực. |
| **Seller** | UC03 - Import from Supplier | Đồng bộ danh mục hàng từ Supplier vào gian hàng của mình. |
| **Seller** | UC04 - Order Processing | Chuyển đổi trạng thái đơn hàng từ mới sang đang giao. |
| **Supplier** | UC05 - Bulk Update Price | Cập nhật giá sỉ cho hàng nghìn mã hàng bằng file Excel. |
| **Admin** | UC06 - Dispute Resolution | Giải quyết tranh chấp giữa Khách và Seller về chất lượng hàng. |

---

### 8. Gợi ý mở rộng (Extensions)

1.  **Hỗ trợ Dropshipping:** Cho phép Seller bán hàng mà không cần nhập kho, Supplier sẽ đóng gói và ghi thông tin người gửi là Seller.
2.  **AI Recommendation:** Gợi ý linh kiện dựa trên lịch sử bảo dưỡng và loại xe của người dùng (ví dụ: "Xe của bạn đi được 40,000 km, bạn nên thay lọc dầu").
3.  **Auto-Sourcing:** Tự động đề xuất Supplier có giá sỉ tốt nhất và tồn kho ổn định nhất cho Seller.
4.  **Tích hợp Gara:** Kết nối đơn hàng linh kiện với lịch hẹn sửa chữa tại các Gara đối tác gần nhất.
