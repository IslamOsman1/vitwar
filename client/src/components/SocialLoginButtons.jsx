import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

const loadGoogleScript = () => new Promise((resolve, reject) => {
  if (window.google?.accounts?.id) {
    resolve();
    return;
  }

  const existing = document.querySelector('script[data-google-gsi="true"]');
  if (existing) {
    existing.addEventListener('load', resolve, { once: true });
    existing.addEventListener('error', reject, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.dataset.googleGsi = 'true';
  script.addEventListener('load', resolve, { once: true });
  script.addEventListener('error', reject, { once: true });
  document.head.appendChild(script);
});

export default function SocialLoginButtons() {
  const { settings, refresh } = useStoreSettings();
  const { googleLogin } = useAuth();
  const googleClientId = settings?.googleClientId;
  const initializedClientIdRef = useRef('');

  const ensureGoogleReady = async (clientId) => {
    await loadGoogleScript();
    if (!window.google?.accounts?.id) {
      throw new Error('google-sdk-unavailable');
    }

    if (initializedClientIdRef.current === clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await googleLogin(response.credential);
        } catch (error) {
          toast.error(error.response?.data?.message || 'فشل تسجيل الدخول بجوجل');
        }
      }
    });

    initializedClientIdRef.current = clientId;
  };

  useEffect(() => {
    if (!googleClientId) return;

    ensureGoogleReady(googleClientId).catch(() => {
      toast.error('تعذر تحميل تسجيل الدخول بجوجل');
    });
  }, [googleClientId]);

  const handleGoogleLogin = async () => {
    let clientId = googleClientId;

    if (!clientId) {
      try {
        const freshSettings = await refresh();
        clientId = freshSettings?.googleClientId || '';
      } catch {
        clientId = '';
      }
    }

    if (!clientId) {
      toast.error('تسجيل الدخول بجوجل غير متاح حاليًا، تأكد من GOOGLE_CLIENT_ID وإعادة نشر السيرفر');
      return;
    }

    try {
      await ensureGoogleReady(clientId);
      window.google.accounts.id.prompt();
    } catch {
      toast.error('تعذر تحميل تسجيل الدخول بجوجل');
    }
  };

  return <div className="social-login-stack icons-only-social-login">
    <button
      type="button"
      className={`social-icon-btn google-social-btn${googleClientId ? '' : ' social-icon-disabled'}`}
      onClick={handleGoogleLogin}
      title="تسجيل الدخول بجوجل"
      aria-label="تسجيل الدخول بجوجل"
    >
      <span className="google-icon-mark" aria-hidden="true">G</span>
    </button>
  </div>;
}
