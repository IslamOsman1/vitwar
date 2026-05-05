import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Facebook } from 'lucide-react';
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

const loadFacebookScript = () => new Promise((resolve, reject) => {
  if (window.FB) {
    resolve();
    return;
  }

  const existing = document.querySelector('script[data-facebook-sdk="true"]');
  if (existing) {
    existing.addEventListener('load', resolve, { once: true });
    existing.addEventListener('error', reject, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://connect.facebook.net/en_US/sdk.js';
  script.async = true;
  script.defer = true;
  script.crossOrigin = 'anonymous';
  script.dataset.facebookSdk = 'true';
  script.addEventListener('load', resolve, { once: true });
  script.addEventListener('error', reject, { once: true });
  document.head.appendChild(script);
});

export default function SocialLoginButtons() {
  const { settings } = useStoreSettings();
  const { googleLogin, facebookLogin } = useAuth();
  const googleClientId = settings?.googleClientId;
  const facebookAppId = settings?.facebookAppId;

  useEffect(() => {
    let active = true;
    if (!googleClientId) return undefined;

    loadGoogleScript()
      .then(() => {
        if (!active || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            try {
              await googleLogin(response.credential);
            } catch (error) {
              toast.error(error.response?.data?.message || 'فشل تسجيل الدخول بجوجل');
            }
          }
        });
      })
      .catch(() => {
        if (active) toast.error('تعذر تحميل تسجيل الدخول بجوجل');
      });

    return () => {
      active = false;
    };
  }, [googleClientId, googleLogin]);

  useEffect(() => {
    let active = true;
    if (!facebookAppId) return undefined;

    loadFacebookScript()
      .then(() => {
        if (!active || !window.FB) return;
        window.FB.init({
          appId: facebookAppId,
          cookie: true,
          xfbml: false,
          version: 'v20.0'
        });
      })
      .catch(() => {
        if (active) toast.error('تعذر تحميل تسجيل الدخول بفيس بوك');
      });

    return () => {
      active = false;
    };
  }, [facebookAppId]);

  const handleGoogleLogin = () => {
    if (!googleClientId || !window.google?.accounts?.id) {
      toast.error('تسجيل الدخول بجوجل غير متاح حاليًا');
      return;
    }

    window.google.accounts.id.prompt();
  };

  const handleFacebookLogin = () => {
    if (!facebookAppId || !window.FB) {
      toast.error('تسجيل الدخول بفيس بوك غير متاح حاليًا');
      return;
    }

    window.FB.login(async (response) => {
      const accessToken = response?.authResponse?.accessToken;
      if (!accessToken) return;

      try {
        await facebookLogin(accessToken);
      } catch (error) {
        toast.error(error.response?.data?.message || 'فشل تسجيل الدخول بفيس بوك');
      }
    }, { scope: 'public_profile,email' });
  };

  return <div className="social-login-stack icons-only-social-login">
    {googleClientId ? <button
      type="button"
      className="social-icon-btn google-social-btn"
      onClick={handleGoogleLogin}
      title="تسجيل الدخول بجوجل"
      aria-label="تسجيل الدخول بجوجل"
    >
      <span className="google-icon-mark" aria-hidden="true">G</span>
    </button> : <button
      type="button"
      className="social-icon-btn google-social-btn social-icon-disabled"
      onClick={handleGoogleLogin}
      title="تسجيل الدخول بجوجل"
      aria-label="تسجيل الدخول بجوجل"
    >
      <span className="google-icon-mark" aria-hidden="true">G</span>
    </button>}

    {facebookAppId ? <button
      type="button"
      className="social-icon-btn facebook-social-btn"
      onClick={handleFacebookLogin}
      title="تسجيل الدخول بفيس بوك"
      aria-label="تسجيل الدخول بفيس بوك"
    >
      <Facebook size={20} />
    </button> : <button
      type="button"
      className="social-icon-btn facebook-social-btn social-icon-disabled"
      onClick={handleFacebookLogin}
      title="تسجيل الدخول بفيس بوك"
      aria-label="تسجيل الدخول بفيس بوك"
    >
      <Facebook size={20} />
    </button>}
  </div>;
}
