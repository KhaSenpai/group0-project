import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// 1. Tạo Context
export const AuthContext = createContext();

// 2. Tạo Provider (Component cha)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Hàm kiểm tra đăng nhập khi tải lại trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Nếu có token, gọi API /profile để lấy thông tin user
      api.get('/profile')
        .then(res => {
          setUser(res.data); // Lưu thông tin user vào state
          setLoading(false);
        })
        .catch(() => {
          // Token hỏng hoặc hết hạn
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []); // Chỉ chạy 1 lần khi app khởi động

  // 4. Hàm Login
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // 5. Hàm Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  // 6. Hàm cập nhật user (khi update profile)
  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  if (loading) {
    return <div>Đang tải ứng dụng...</div>; // Màn hình chờ
  }

  // 7. Cung cấp state và hàm cho các component con
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};