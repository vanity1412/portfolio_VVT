# Requirements Document

## Introduction

Dự án này nhằm đảm bảo website portfolio chạy đúng với live server và tích hợp các file bài viết từ thư mục posts vào blog.html một cách chính xác, không có lỗi logic nào.

## Glossary

- **Live Server**: Môi trường phát triển web cục bộ cho phép xem trước website trong thời gian thực
- **Blog Integration**: Quá trình kết nối và hiển thị các bài viết blog từ thư mục posts vào trang blog.html
- **Path Resolution**: Xử lý đường dẫn tương đối giữa các file HTML, CSS, JS và assets
- **Component Loading**: Cơ chế tải header, footer, sidebar động vào các trang
- **Post Structure**: Cấu trúc thư mục posts với các danh mục blue, cloud, projects, writeup

## Requirements

### Requirement 1: Đảm bảo đường dẫn tương đối chính xác

**User Story:** Là người dùng, tôi muốn tất cả các đường dẫn (CSS, JS, images, links) hoạt động đúng khi truy cập từ bất kỳ trang nào

#### Acceptance Criteria

1. WHEN người dùng truy cập index.html, THE System SHALL hiển thị đúng tất cả CSS, JS, và images
2. WHEN người dùng truy cập blog.html, THE System SHALL hiển thị đúng tất cả CSS, JS, và images
3. WHEN người dùng truy cập các file trong thư mục components/, THE System SHALL điều chỉnh đường dẫn với prefix "../"
4. WHEN người dùng truy cập các file trong thư mục posts/, THE System SHALL điều chỉnh đường dẫn với prefix "../../"
5. WHEN người dùng click vào navigation links, THE System SHALL điều hướng đến đúng trang với đường dẫn tương đối chính xác

### Requirement 2: Tích hợp danh sách bài viết vào blog.html

**User Story:** Là người dùng, tôi muốn thấy tất cả các bài viết từ thư mục posts được hiển thị đầy đủ và chính xác trên trang blog.html

#### Acceptance Criteria

1. THE System SHALL hiển thị tất cả bài viết từ thư mục posts/blue/ trên blog.html
2. THE System SHALL hiển thị tất cả bài viết từ thư mục posts/cloud/ trên blog.html
3. THE System SHALL hiển thị tất cả bài viết từ thư mục posts/projects/ trên blog.html
4. THE System SHALL hiển thị tất cả bài viết từ thư mục posts/writeup/ trên blog.html
5. WHEN người dùng click vào một bài viết, THE System SHALL điều hướng đến đúng file HTML của bài viết đó

### Requirement 3: Chức năng lọc bài viết theo danh mục

**User Story:** Là người dùng, tôi muốn lọc bài viết theo danh mục (Blue Team, Cloud Security, Projects, Writeup) để dễ dàng tìm kiếm nội dung

#### Acceptance Criteria

1. WHEN người dùng click vào nút filter "Tất cả", THE System SHALL hiển thị tất cả bài viết
2. WHEN người dùng click vào nút filter "Blue Team", THE System SHALL chỉ hiển thị các bài viết có data-category="blue"
3. WHEN người dùng click vào nút filter "Cloud Security", THE System SHALL chỉ hiển thị các bài viết có data-category="cloud"
4. WHEN người dùng click vào nút filter "Projects", THE System SHALL chỉ hiển thị các bài viết có data-category="projects"
5. WHEN người dùng click vào nút filter "Writeup", THE System SHALL chỉ hiển thị các bài viết có data-category="writeup"

### Requirement 4: Component loading hoạt động đúng

**User Story:** Là người dùng, tôi muốn header, footer, và sidebar được tải đúng trên mọi trang

#### Acceptance Criteria

1. WHEN người dùng truy cập bất kỳ trang nào, THE System SHALL tải header.html vào placeholder
2. WHEN người dùng truy cập bất kỳ trang nào, THE System SHALL tải footer.html vào placeholder
3. WHEN người dùng truy cập bất kỳ trang nào, THE System SHALL tải sidebar.html vào placeholder
4. WHEN component được tải, THE System SHALL điều chỉnh đường dẫn images trong component theo vị trí trang hiện tại
5. WHEN component được tải, THE System SHALL cập nhật navigation links theo vị trí trang hiện tại

### Requirement 5: Metadata và SEO cho các bài viết

**User Story:** Là người dùng, tôi muốn mỗi bài viết có metadata đầy đủ (title, description, tags, date) để dễ tìm kiếm và chia sẻ

#### Acceptance Criteria

1. THE System SHALL hiển thị title chính xác cho mỗi bài viết trên blog.html
2. THE System SHALL hiển thị description/excerpt cho mỗi bài viết trên blog.html
3. THE System SHALL hiển thị tags cho mỗi bài viết trên blog.html
4. THE System SHALL hiển thị ngày đăng cho mỗi bài viết trên blog.html
5. THE System SHALL hiển thị thời gian đọc ước tính cho mỗi bài viết trên blog.html

### Requirement 6: Responsive và tương thích trình duyệt

**User Story:** Là người dùng, tôi muốn website hoạt động mượt mà trên mọi thiết bị và trình duyệt

#### Acceptance Criteria

1. WHEN người dùng truy cập trên desktop, THE System SHALL hiển thị layout desktop với sidebar mở mặc định
2. WHEN người dùng truy cập trên mobile, THE System SHALL hiển thị layout mobile với sidebar ẩn mặc định
3. WHEN người dùng resize cửa sổ, THE System SHALL điều chỉnh layout phù hợp
4. THE System SHALL hoạt động đúng trên Chrome, Firefox, Safari, Edge
5. THE System SHALL không có lỗi console JavaScript trên bất kỳ trang nào

### Requirement 7: Audio player hoạt động đúng

**User Story:** Là người dùng, tôi muốn audio player hoạt động đúng trên mọi trang với đường dẫn nhạc chính xác

#### Acceptance Criteria

1. WHEN người dùng truy cập trang, THE System SHALL hiển thị audio player
2. WHEN người dùng click play, THE System SHALL phát nhạc từ đường dẫn chính xác
3. WHEN người dùng điều chỉnh volume, THE System SHALL thay đổi âm lượng
4. THE System SHALL điều chỉnh đường dẫn file nhạc theo vị trí trang hiện tại
5. WHEN người dùng chuyển trang, THE System SHALL duy trì trạng thái phát nhạc (nếu có global audio)

### Requirement 8: Kiểm tra và xử lý lỗi

**User Story:** Là developer, tôi muốn hệ thống phát hiện và xử lý các lỗi một cách graceful

#### Acceptance Criteria

1. WHEN component loading thất bại, THE System SHALL log lỗi vào console
2. WHEN image không tải được, THE System SHALL hiển thị placeholder hoặc alt text
3. WHEN JavaScript có lỗi, THE System SHALL không làm crash toàn bộ trang
4. THE System SHALL validate tất cả đường dẫn trước khi sử dụng
5. THE System SHALL có fallback cho các tính năng không được hỗ trợ
