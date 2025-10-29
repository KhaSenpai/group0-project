import axios from 'axios';

// Đặt base URL cho tất cả các request
const api = axios.create({
  // SỬA DÒNG NÀY
  baseURL: process.env.REACT_APP_API_URL, 
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