import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { logout } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError('Bạn không có quyền truy cập hoặc đã có lỗi xảy ra.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Xóa thất bại');
      }
    }
  };

  if (error) return <div className="admin-container"><div className="error-message">{error}</div></div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Trang Quản Trị - Danh Sách User</h2>
        <button className="logout-btn" onClick={logout}>Đăng xuất</button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>Không có user nào</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td><img src={user.avatarUrl} alt="Avatar" className="admin-avatar" /></td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user._id)}
                        disabled={user.role === 'Admin'}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default AdminDashboard;