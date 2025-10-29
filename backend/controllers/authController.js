const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Đăng ký user mới (Buổi 5 - HĐ 1)
// @route   POST /signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const user = await User.create({ name, email, password });
    
    // Đăng ký xong thì trả về token để tự động đăng nhập luôn
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: { // Trả về thông tin user (trừ password)
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đăng nhập user (Buổi 5 - HĐ 1)
// @route   POST /login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm user và lấy cả password (vì schema đang select: false)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Tạo token
      const token = generateToken(user._id);
      
      res.status(200).json({
        message: 'Đăng nhập thành công',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } else {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Quên mật khẩu (Buổi 5 - HĐ 4)
// @route   POST /forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy email' });
    }

    // Lấy token reset từ method của User model
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false }); // Lưu (bỏ qua validate)

    // Tạo URL reset (Frontend)
    // Cổng 3000 là của React
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu reset mật khẩu. Vui lòng truy cập link sau để đặt lại mật khẩu: \n\n ${resetUrl} \n\n Link này sẽ hết hạn sau 10 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua.`;

    // Gửi email
    await sendEmail({
      email: user.email,
      subject: 'Yêu cầu reset mật khẩu',
      message: message,
    });

    res.status(200).json({ message: 'Email đã được gửi, vui lòng kiểm tra hộp thư.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Gửi email thất bại' });
  }
};

// @desc    Reset mật khẩu (Buổi 5 - HĐ 4)
// @route   POST /reset-password/:token
exports.resetPassword = async (req, res) => {
  // 1. Mã hóa token từ URL để so sánh với DB
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Kiểm tra token còn hạn
    });

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // 2. Đặt mật khẩu mới
    user.password = req.body.password;
    user.resetPasswordToken = undefined; // Xóa token
    user.resetPasswordExpire = undefined;
    await user.save(); // Middleware pre-save sẽ tự động hash password mới

    res.status(200).json({ message: 'Reset mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo Admin (Chỉ dùng 1 lần để setup)
// @route   POST /create-admin
exports.createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Kiểm tra admin đã tồn tại chưa
    const adminExists = await User.findOne({ role: 'Admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin đã tồn tại' });
    }

    // Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Tạo admin
    const admin = await User.create({
      name: name || 'Admin',
      email: email || 'admin@example.com',
      password: password || 'admin123',
      role: 'Admin'
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      message: 'Tạo Admin thành công',
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatarUrl: admin.avatarUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};