import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3000/api/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Ứng dụng quản lý người dùng</h1>
      <AddUser fetchUsers={fetchUsers} />
      <UserList users={users} />
    </div>
  );
};

export default App;