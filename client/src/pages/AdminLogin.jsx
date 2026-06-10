import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PasswordField from '../components/PasswordField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;

  const submit = async (event) => {
    event.preventDefault();
    try {
      await adminLogin(username, password);
      navigate('/admin', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تسجيل الدخول');
    }
  };

  return (
    <div className="auth-card auth-extended-card">
      <h1>دخول لوحة التحكم</h1>
      <p className="muted">استخدم اسم المستخدم وكلمة المرور المخزنين في متغيرات البيئة.</p>

      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />
        <PasswordField
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="كلمة المرور"
          autoComplete="current-password"
        />
        <button className="primary-btn" type="submit">دخول لوحة التحكم</button>
      </form>
    </div>
  );
}
