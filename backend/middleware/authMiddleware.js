const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Middleware 1: Bảo vệ (Yêu cầu đăng nhập)
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Tách token ra (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Xác thực token
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Lấy user từ ID trong token, gắn vào req.user
      // Gắn user vào req để các hàm sau có thể dùng
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
         return res.status(401).json({ message: 'User không tồn tại' });
      }

      next(); // Đi tiếp
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Chưa đăng nhập, không có token' });
  }
};

// Middleware 2: Phân quyền (Yêu cầu là Admin)
exports.admin = (req, res, next) => {
  // Middleware này phải chạy SAU middleware 'protect'
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Không có quyền Admin' });
  }
};