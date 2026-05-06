import bcrypt from 'bcryptjs';
import { ensureStoreSettings } from './storeSettings.js';

export const getDeleteProtectionState = async () => {
  const settings = await ensureStoreSettings();
  const adminControls = settings.adminControls || {};

  return {
    settings,
    enabled: adminControls.deleteConfirmationEnabled === true,
    hasPassword: Boolean(adminControls.deletePasswordHash)
  };
};

export const assertDeletePassword = async (password) => {
  const { settings, enabled, hasPassword } = await getDeleteProtectionState();
  if (!enabled) return settings;

  if (!hasPassword) {
    const error = new Error('حماية الحذف مفعلة لكن لم يتم ضبط كلمة مرور الحذف بعد');
    error.statusCode = 400;
    throw error;
  }

  const isValid = await bcrypt.compare(String(password || ''), settings.adminControls.deletePasswordHash);
  if (!isValid) {
    const error = new Error('كلمة مرور الحذف غير صحيحة');
    error.statusCode = 403;
    throw error;
  }

  return settings;
};
