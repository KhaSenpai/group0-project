const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Email không hợp lệ'],
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: 6,
    select: false, // Quan trọng: Không trả về password khi query user
  },
  role: {
    type: String,
    enum: ['User', 'Admin'], // Phân quyền
    default: 'User',
  },
  avatarUrl: {
    type: String,
    default: 'https://i.imgur.com/6VBx3io.png' // Link ảnh đại diện mặc định
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true // Tự động thêm createdAt, updatedAt
});

// Middleware: Tự động mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  // Chỉ mã hóa nếu mật khẩu được sửa đổi (hoặc là user mới)
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: So sánh mật khẩu đã nhập với mật khẩu đã mã hóa
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method: Tạo token reset mật khẩu (Hoạt động 4 - Buổi 5)
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Mã hóa token và lưu vào DB
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Đặt thời gian hết hạn (10 phút)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken; // Trả về token (chưa mã hóa) để gửi email
};

module.exports = mongoose.model('User', userSchema);