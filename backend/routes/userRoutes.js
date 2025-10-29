const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile,
  uploadAvatar,
  getAllUsers, 
  deleteUser 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary'); // Middleware upload

// Routes cho User cá nhân (Yêu cầu đăng nhập)
router.route('/profile')
  .get(protect, getProfile)     // Lấy thông tin
  .put(protect, updateProfile);  // Cập nhật thông tin

router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

// Routes cho Admin (Yêu cầu đăng nhập + quyền Admin)
router.route('/users')
  .get(protect, admin, getAllUsers); // Lấy tất cả user

router.route('/users/:id')
  .delete(protect, admin, deleteUser); // Xóa user

module.exports = router;