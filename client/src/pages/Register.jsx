import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SocialLoginButtons from '../components/SocialLoginButtons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إنشاء الحساب');
    }
  };

  return <div className="auth-card auth-extended-card">
    <h1>إنشاء حساب</h1>
    <form onSubmit={submit}>
      {['name', 'email', 'phone', 'password'].map((name) => <input
        key={name}
        name={name}
        type={name === 'password' ? 'password' : 'text'}
        placeholder={{
          name: 'الاسم',
          email: 'البريد الإلكتروني',
          phone: 'الهاتف',
          password: 'كلمة المرور'
        }[name]}
        onChange={change}
      />)}
      <button className="primary-btn">تسجيل</button>
    </form>

    <div className="auth-divider"><span>أو</span></div>
    <SocialLoginButtons />

    <p>لديك حساب بالفعل؟ <Link to="/login">سجل الدخول</Link></p>
  </div>;
}
