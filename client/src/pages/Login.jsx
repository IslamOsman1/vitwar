import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/api.js';
import SocialLoginButtons from '../components/SocialLoginButtons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [phoneVerificationToken, setPhoneVerificationToken] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const { login, loginWithPhoneCode } = useAuth();
  const navigate = useNavigate();

  const sendCode = async () => {
    if (!phone.trim()) {
      toast.error('أدخل رقم الهاتف أولًا');
      return;
    }

    try {
      setSendingCode(true);
      await api.post('/auth/phone/send-code', { phone: phone.trim() });
      setOtpSent(true);
      setOtpVerified(false);
      setPhoneVerificationToken('');
      toast.success('تم إرسال رمز التحقق');
    } catch (error) {
      toast.error(error.response?.data?.message || 'تعذر إرسال رمز التحقق');
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
    if (!otpCode.trim()) {
      toast.error('أدخل رمز التحقق');
      return;
    }

    try {
      setCheckingCode(true);
      const { data } = await api.post('/auth/phone/verify-code', {
        phone: phone.trim(),
        code: otpCode
      });
      setOtpVerified(true);
      setPhoneVerificationToken(data.phoneVerificationToken || '');
      toast.success('تم تأكيد رقم الهاتف');
    } catch (error) {
      toast.error(error.response?.data?.message || 'رمز التحقق غير صحيح');
    } finally {
      setCheckingCode(false);
    }
  };

  const submitPasswordLogin = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل الدخول');
    }
  };

  const submitPhoneLogin = async (event) => {
    event.preventDefault();

    if (!otpVerified || !phoneVerificationToken) {
      toast.error('يجب تأكيد رقم الهاتف أولًا');
      return;
    }

    try {
      await loginWithPhoneCode(phone.trim(), phoneVerificationToken);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل الدخول برقم الهاتف');
    }
  };

  return <div className="auth-card auth-extended-card">
    <h1>تسجيل الدخول</h1>

    <div className="auth-mode-switch">
      <button
        type="button"
        className={`auth-mode-btn${mode === 'password' ? ' active' : ''}`}
        onClick={() => setMode('password')}
      >
        البريد وكلمة المرور
      </button>
      <button
        type="button"
        className={`auth-mode-btn${mode === 'phone' ? ' active' : ''}`}
        onClick={() => setMode('phone')}
      >
        رقم الهاتف
      </button>
    </div>

    {mode === 'password'
      ? <form onSubmit={submitPasswordLogin}>
        <input placeholder="البريد الإلكتروني" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="primary-btn">دخول</button>
      </form>
      : <form onSubmit={submitPhoneLogin}>
        <div className="otp-inline-row">
          <input
            type="text"
            placeholder="رقم الهاتف بصيغة دولية مثل +2010..."
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setOtpSent(false);
              setOtpVerified(false);
              setOtpCode('');
              setPhoneVerificationToken('');
            }}
          />
          <button type="button" className="secondary-btn otp-action-btn" onClick={sendCode} disabled={sendingCode}>
            {sendingCode ? 'جارٍ الإرسال...' : otpSent ? 'إعادة الإرسال' : 'إرسال الكود'}
          </button>
        </div>

        {otpSent && <div className="otp-inline-row">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="رمز التحقق المكون من 6 أرقام"
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <button type="button" className="secondary-btn otp-action-btn" onClick={verifyCode} disabled={checkingCode || otpVerified}>
            {otpVerified ? 'تم التأكيد' : checkingCode ? 'جارٍ التحقق...' : 'تأكيد الكود'}
          </button>
        </div>}

        <div className="otp-status-row">
          <span className={`otp-status-chip${otpVerified ? ' verified' : ''}`}>
            {otpVerified ? 'تم تأكيد رقم الهاتف' : 'أكد رقم الهاتف لإكمال الدخول'}
          </span>
        </div>

        <button className="primary-btn">دخول برقم الهاتف</button>
      </form>}

    <p className="auth-helper-links">
      <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
    </p>

    <div className="auth-divider"><span>أو</span></div>
    <SocialLoginButtons />

    <p>ليس لديك حساب؟ <Link to="/register">أنشئ حساب</Link></p>
  </div>;
}
