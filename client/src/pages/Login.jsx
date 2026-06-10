import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SocialLoginButtons from '../components/SocialLoginButtons.jsx';
import PasswordField from '../components/PasswordField.jsx';
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
      toast.error(error.response?.data?.message || 'فشل تسجيل الدخول');
    }
  };

  return (
    <div className="auth-card auth-extended-card">
      <h1>تسجيل الدخول</h1>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordField
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="كلمة المرور"
        />
        <button className="primary-btn">دخول</button>
      </form>

      <p className="auth-helper-links">
        <Link to="/forgot-password">هل نسيت كلمة السر؟</Link>
      </p>

      <div className="auth-divider"><span>أو</span></div>
      <SocialLoginButtons />

      <p>ليس لديك حساب؟ <Link to="/">العودة للرئيسية</Link></p>
      <p className="auth-policy-links">
        <Link to="/policies/terms">الشروط والأحكام</Link>
        <span>•</span>
        <Link to="/policies/privacy">سياسة الخصوصية</Link>
      </p>
    </div>
  );
}
