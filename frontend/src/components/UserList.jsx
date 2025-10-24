import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    try {
      await axios.post(`${API_URL}/users`, formData);
      setFormData({ name: '', email: '', age: '' });
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
      console.error(err);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error(err);
      }
    }
  };

  // Update user
  const handleUpdateUser = async (id) => {
    try {
      await axios.put(`${API_URL}/users/${id}`, formData);
      setFormData({ name: '', email: '', age: '' });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  // Start editing
  const handleEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age || ''
    });
    setEditingId(user._id);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setFormData({ name: '', email: '', age: '' });
    setEditingId(null);
  };

  return (
    <div className="user-list-container">
      <h1>User Management</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Form */}
      <form className="user-form" onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdateUser(editingId); } : handleCreateUser}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="Enter age"
            min="0"
            max="150"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update User' : 'Add User'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Users List */}
      <div className="users-section">
        <h2>Users List</h2>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : users.length === 0 ? (
          <p className="no-users">No users found</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age || '-'}</td>
                  <td className="actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;

