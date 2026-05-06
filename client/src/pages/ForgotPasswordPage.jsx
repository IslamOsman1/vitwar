import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/api.js';

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [phoneVerificationToken, setPhoneVerificationToken] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const [saving, setSaving] = useState(false);
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
      setOtpCode('');
      setPhoneVerificationToken('');
      toast.success('تم إرسال رمز التحقق');
    } catch (error) {
      toast.error(error.response?.data?.message || 'تعذر إرسال رمز التحقق');
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
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

  const submit = async (event) => {
    event.preventDefault();

    if (!otpVerified || !phoneVerificationToken) {
      toast.error('يجب تأكيد رقم الهاتف أولًا');
      return;
    }

    if (newPassword.trim().length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('تأكيد كلمة المرور غير مطابق');
      return;
    }

    try {
      setSaving(true);
      await api.post('/auth/reset-password/phone', {
        phone: phone.trim(),
        phoneVerificationToken,
        password: newPassword
      });
      toast.success('تم تحديث كلمة المرور');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'تعذر تحديث كلمة المرور');
    } finally {
      setSaving(false);
    }
  };

  return <div className="auth-card auth-extended-card">
    <h1>استرجاع كلمة المرور</h1>
    <p className="muted">أدخل رقم الهاتف، ثم رمز التحقق، ثم كلمة المرور الجديدة.</p>

    <form onSubmit={submit}>
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
          {otpVerified ? 'تم تأكيد رقم الهاتف' : 'يجب تأكيد رقم الهاتف أولًا'}
        </span>
      </div>

      <input
        type="password"
        placeholder="كلمة المرور الجديدة"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
      />
      <input
        type="password"
        placeholder="تأكيد كلمة المرور"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
      <button className="primary-btn" disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'تحديث كلمة المرور'}</button>
    </form>

    <p>تذكرت كلمة المرور؟ <Link to="/login">العودة لتسجيل الدخول</Link></p>
  </div>;
}
