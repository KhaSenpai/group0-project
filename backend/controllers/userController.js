const User = require('../models/User');

// @desc    Lấy thông tin cá nhân (Buổi 5 - HĐ 2)
// @route   GET /profile
// @access  Private (Cần 'protect' middleware)
exports.getProfile = async (req, res) => {
  // req.user đã được gán từ middleware 'protect'
  res.status(200).json(req.user);
};

// @desc    Cập nhật thông tin cá nhân (Buổi 5 - HĐ 2)
// @route   PUT /profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // Nếu user gửi password mới
      if (req.body.password) {
        user.password = req.body.password; // Hook 'pre-save' sẽ tự mã hóa
      }

      const updatedUser = await user.save();
      
      res.status(200).json({
        message: 'Cập nhật thành công',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatarUrl: updatedUser.avatarUrl
        }
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload avatar (Buổi 5 - HĐ 4)
// @route   POST /upload-avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
    }

    // Tìm user và cập nhật avatarUrl
    const user = await User.findById(req.user.id);

    // Lấy URL từ Cloudinary (req.file.path)
    // Nếu Cloudinary chưa cấu hình, sử dụng URL mặc định
    const avatarUrl = req.file.path || `https://via.placeholder.com/150?text=${user.name}`;

    user.avatarUrl = avatarUrl;
    await user.save();

    res.status(200).json({
      message: 'Upload avatar thành công',
      user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: error.message || 'Lỗi upload avatar' });
  }
};

// --- ADMIN CONTROLLERS ---

// @desc    Lấy tất cả user (Buổi 4 + Buổi 5 - HĐ 3)
// @route   GET /users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa user (Buổi 4 + Buổi 5 - HĐ 3)
// @route   DELETE /users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if(user.role === 'Admin') {
         return res.status(400).json({ message: 'Không thể xóa Admin' });
      }
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Xóa user thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};