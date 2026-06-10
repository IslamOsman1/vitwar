import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/api.js';
import PasswordField from '../components/PasswordField.jsx';
import useOtpCooldown from '../hooks/useOtpCooldown.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { timeLeft, isCoolingDown, startCooldown, resetCooldown } = useOtpCooldown();

  const sendCode = async () => {
    if (!email.trim()) {
      toast.error('أدخل البريد الإلكتروني');
      return;
    }

    try {
      setSendingCode(true);
      await api.post('/auth/reset-password/email/send-code', { email });
      setCodeSent(true);
      startCooldown(60);
      toast.success('تم إرسال كود التحقق إلى البريد الإلكتروني');
    } catch (error) {
      toast.error(error.response?.data?.message || 'تعذر إرسال كود التحقق');
    } finally {
      setSendingCode(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('أدخل البريد الإلكتروني');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      toast.error('أدخل كودًا مكونًا من 6 أرقام');
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
      await api.post('/auth/reset-password/email/confirm', {
        email,
        code,
        password: newPassword
      });
      toast.success('تم تحديث كلمة المرور');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'تعذر تحديث كلمة المرور');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-card auth-extended-card">
      <h1>استرجاع كلمة المرور</h1>
      <p className="muted">أدخل البريد الإلكتروني وسنرسل لك كودًا من 6 أرقام لإعادة تعيين كلمة المرور.</p>

      <form onSubmit={submit}>
        <div className="otp-inline-row">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setCodeSent(false);
              setCode('');
              resetCooldown();
            }}
          />
          <button type="button" className="secondary-btn otp-action-btn" onClick={sendCode} disabled={sendingCode || isCoolingDown}>
            {sendingCode ? 'جارٍ الإرسال...' : isCoolingDown ? `إعادة الإرسال خلال ${timeLeft}s` : codeSent ? 'إعادة الإرسال' : 'إرسال الكود'}
          </button>
        </div>

        {codeSent ? (
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="كود التحقق المكون من 6 أرقام"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
          />
        ) : null}

        <PasswordField
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="كلمة المرور الجديدة"
          autoComplete="new-password"
        />
        <PasswordField
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="تأكيد كلمة المرور"
          autoComplete="new-password"
        />
        <button className="primary-btn" disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'تحديث كلمة المرور'}</button>
      </form>

      <p>تذكرت كلمة المرور؟ <Link to="/">العودة للرئيسية</Link></p>
    </div>
  );
}
