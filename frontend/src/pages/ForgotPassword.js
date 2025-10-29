import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/forgot-password', { email });
      setMessage('Kiểm tra email của bạn để lấy link reset mật khẩu.');
    } catch (err) {
      setError(err.response?.data?.message || 'Email không tồn tại hoặc có lỗi xảy ra.');
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Quên Mật Khẩu</h2>
        <p>Nhập email, chúng tôi sẽ gửi bạn link reset mật khẩu.</p>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          required
        />
        <button type="submit">Gửi</button>
      </form>
      <div className="forgot-password-links">
        <p><Link to="/login">Quay lại Đăng nhập</Link></p>
      </div>
    </div>
  );
}
export default ForgotPassword;