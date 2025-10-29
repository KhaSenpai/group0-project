import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

function Profile() {
  const { user, updateUser, logout } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [avatar, setAvatar] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');

    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }

    try {
      const res = await api.put('/profile', updateData);
      updateUser(res.data.user);
      setMessage('Cập nhật thành công!');
      setMessageType('success');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Lỗi cập nhật');
      setMessageType('error');
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!avatar) {
      setMessage('Vui lòng chọn 1 file ảnh');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const res = await api.post('/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(res.data.user);
      setMessage('Upload avatar thành công!');
      setMessageType('success');
      setAvatar(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Lỗi upload avatar');
      setMessageType('error');
    }
  };

  if (!user) return <div className="profile-container"><p>Đang tải...</p></div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Trang Cá Nhân</h2>
        <button className="logout-btn" onClick={logout}>Đăng xuất</button>
      </div>

      <div className="profile-info">
        <div className="profile-avatar">
          <img src={user.avatarUrl} alt="Avatar" />
        </div>
        <div className="profile-details">
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Vai trò:</strong> {user.role}</p>
        </div>
      </div>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <div className="profile-section">
        <h3>Đổi Avatar</h3>
        <form onSubmit={handleAvatarUpload} className="profile-form">
          <div className="avatar-upload">
            <input
              type="file"
              onChange={e => setAvatar(e.target.files[0])}
              accept="image/*"
            />
            <button type="submit">Upload</button>
          </div>
        </form>
      </div>

      <div className="profile-section">
        <h3>Cập nhật thông tin</h3>
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <label>Tên:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nhập tên của bạn"
          />
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
          <label>Mật khẩu mới (Bỏ trống nếu không đổi):</label>
          <div className="password-input-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
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
          <button type="submit">Cập nhật</button>
        </form>
      </div>
    </div>
  );
}
export default Profile;