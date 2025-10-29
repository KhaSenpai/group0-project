const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async (options) => {
  // 1. Tạo transporter (Dịch vụ gửi mail - VD: Gmail)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Dùng Gmail
    auth: {
      user: config.EMAIL_USER, // Email của bạn
      pass: config.EMAIL_PASS, // Mật khẩu ứng dụng
    },
  });

  // 2. Định nghĩa các tùy chọn email
  const mailOptions = {
    from: `Admin <${config.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Gửi mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;