import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Hàm kiểm tra xác thực nâng cao
  const kiemTraXacThuc = () => {
    try {
      // Lấy token từ localStorage
      const tokenLuuTru = localStorage.getItem("tokenGoogle");
      
      // Ghi log token để debug
      // Kiểm tra token có tồn tại không
      if (!tokenLuuTru) {
        console.warn("Không tìm thấy token trong localStorage");
        return false;
      }

      // Chuyển đổi token
      const tokenParsed = JSON.parse(tokenLuuTru);
      
      // Kiểm tra cấu trúc token (điều chỉnh theo cấu trúc của bạn)
      if (!tokenParsed || !tokenParsed) {
        console.warn("Cấu trúc token không hợp lệ");
        return false;
      }

      // Kiểm tra thời hạn token (nếu có)


      return true;
    } catch (error) {
      console.error("Lỗi kiểm tra xác thực:", error);
      return false;
    }
  };

  // Kiểm tra trạng thái xác thực
  const daDangNhap = kiemTraXacThuc();

  // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
  if (!daDangNhap) {
    console.log("Đang chuyển hướng đến trang đăng nhập");
    return <Navigate to="/game-login" state={{ from: location }} replace />;
  }

  // Nếu đã xác thực, hiển thị nội dung
  return children;
};

export default ProtectedRoute;