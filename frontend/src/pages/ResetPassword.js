import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './ResetPassword.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post(`/reset-password/${token}`, { password });
      setMessage('Đổi mật khẩu thành công! Bạn sẽ được chuyển về trang đăng nhập.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h2>Đặt Lại Mật Khẩu</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <label htmlFor="passwordInput">Mật khẩu mới</label>
        <div className="password-input-group">
          <input
            type={showPassword ? "text" : "password"}
            id="passwordInput"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <button type="submit">Xác nhận</button>
      </form>
      <div className="reset-password-links">
        <p><Link to="/login">Quay lại Đăng nhập</Link></p>
      </div>
    </div>
  );
}
export default ResetPassword;
