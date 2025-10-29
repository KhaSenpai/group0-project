import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated || !user) {
    // 1. Chưa đăng nhập
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'Admin') {
    // 2. Đã đăng nhập nhưng không phải Admin
    return <Navigate to="/profile" replace />; // Đá về trang profile
  }

  // 3. Là Admin, cho phép truy cập
  return <Outlet />;
};

export default AdminRoute;