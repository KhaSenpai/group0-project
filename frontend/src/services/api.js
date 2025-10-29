import axios from 'axios';

// Đặt base URL cho tất cả các request
// Dòng này sẽ tự động chọn link đúng
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Đặt base URL cho tất cả các request
const api = axios.create({
  baseURL: API_URL, // Dùng biến API_URL ở trên
});

/* Request Interceptor:
  Tự động gắn token (lấy từ localStorage) vào header 'Authorization'
  cho MỌI request gửi đi.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;