import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SocialLoginButtons from '../components/SocialLoginButtons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل الدخول');
    }
  };

  return <div className="auth-card auth-extended-card">
    <h1>تسجيل الدخول</h1>
    <form onSubmit={submit}>
      <input placeholder="البريد الإلكتروني" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input type="password" placeholder="كلمة المرور" value={password} onChange={(event) => setPassword(event.target.value)} />
      <button className="primary-btn">دخول</button>
    </form>

    <div className="auth-divider"><span>أو</span></div>
    <SocialLoginButtons />

    <p>ليس لديك حساب؟ <Link to="/register">أنشئ حساب</Link></p>
  </div>;
}
