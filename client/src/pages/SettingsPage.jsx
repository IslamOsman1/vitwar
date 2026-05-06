import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Pencil, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PasswordField from '../components/PasswordField.jsx';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

const emptyAddress = () => ({
  label: '',
  governorate: '',
  city: '',
  street: '',
  notes: '',
  address: ''
});

const normalizeAddress = (item = {}) => ({
  _id: item._id || '',
  label: item.label || '',
  governorate: item.governorate || '',
  city: item.city || '',
  street: item.street || item.address || '',
  notes: item.notes || '',
  address: item.address || item.street || ''
});

export default function SettingsPage() {
  const { refreshProfile } = useAuth();
  const { settings } = useStoreSettings();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    avatar: '',
    addresses: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addressEditor, setAddressEditor] = useState({
    open: false,
    index: null,
    data: emptyAddress()
  });

  const availableGovernorates = useMemo(
    () => settings?.checkout?.governorates || [],
    [settings]
  );

  const availableCities = useMemo(() => {
    const selectedGovernorate = availableGovernorates.find((item) => item.name === addressEditor.data.governorate);
    return selectedGovernorate?.cities || [];
  }, [addressEditor.data.governorate, availableGovernorates]);

  useEffect(() => {
    api.get('/users/me')
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          password: '',
          avatar: data.avatar || '',
          addresses: data.addresses?.length ? data.addresses.map(normalizeAddress) : []
        });
      })
      .catch(() => toast.error('تعذر تحميل إعدادات الملف الشخصي'))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const openAddressEditor = (index = null) => {
    setAddressEditor({
      open: true,
      index,
      data: index === null ? emptyAddress() : normalizeAddress(form.addresses[index])
    });
  };

  const closeAddressEditor = () => {
    setAddressEditor({
      open: false,
      index: null,
      data: emptyAddress()
    });
  };

  const updateAddressDraft = (key, value) => {
    setAddressEditor((current) => {
      const nextData = { ...current.data, [key]: value };
      if (key === 'governorate') nextData.city = '';
      nextData.address = nextData.street;
      return { ...current, data: nextData };
    });
  };

  const saveAddressDraft = () => {
    const nextAddress = normalizeAddress(addressEditor.data);

    if (!nextAddress.label.trim()) {
      toast.error('أدخل اسم العنوان أولًا');
      return;
    }

    if (!nextAddress.governorate.trim() || !nextAddress.city.trim() || !nextAddress.street.trim()) {
      toast.error('أكمل بيانات العنوان قبل الحفظ');
      return;
    }

    setForm((current) => {
      const nextAddresses = [...current.addresses];
      if (addressEditor.index === null) {
        nextAddresses.unshift(nextAddress);
      } else {
        nextAddresses[addressEditor.index] = nextAddress;
      }
      return { ...current, addresses: nextAddresses };
    });

    closeAddressEditor();
    toast.success('تم تجهيز العنوان الجديد');
  };

  const removeAddress = (index) => {
    setForm((current) => ({
      ...current,
      addresses: current.addresses.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const body = new FormData();
      body.append('image', file);
      const { data } = await api.post('/users/me/avatar', body, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm((current) => ({ ...current, avatar: data.user?.avatar || current.avatar }));
      await refreshProfile();
      toast.success('تم تحديث صورة الملف الشخصي');
    } catch (error) {
      toast.error(error.response?.data?.message || 'تعذر رفع الصورة');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      await api.put('/users/me', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        addresses: form.addresses.map((item) => ({
          label: item.label,
          governorate: item.governorate,
          city: item.city,
          street: item.street,
          notes: item.notes,
          address: item.street
        }))
      });
      await refreshProfile();
      updateField('password', '');
      toast.success('تم حفظ إعدادات الملف الشخصي');
    } catch (error) {
      toast.error(error.response?.data?.message || 'تعذر حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  return <main className="app-shell home-screen market-home settings-page-shell">
    <section className="panel-card settings-page-panel">
      <div className="section-head">
        <div>
          <h1>الإعدادات</h1>
          <p>إعدادات الملف الشخصي</p>
        </div>
      </div>

      {loading
        ? <p className="muted">جاري تحميل الإعدادات...</p>
        : <form className="settings-form" onSubmit={submit}>
          <section className="settings-avatar-block">
            <div className="settings-avatar-preview">
              {form.avatar ? <img src={form.avatar} alt={form.name || 'Avatar'} className="settings-avatar-image" /> : <span>{(form.name || 'AW').trim().slice(0, 2).toUpperCase()}</span>}
            </div>
            <div className="settings-avatar-copy">
              <strong>صورة الملف الشخصي</strong>
              <span>يمكنك رفع صورة جديدة للحساب.</span>
            </div>
            <label className="admin-file-pill settings-upload-pill">
              <input type="file" accept="image/*" onChange={uploadAvatar} />
              {uploading ? 'جارٍ الرفع...' : 'تغيير الصورة'}
            </label>
          </section>

          <div className="settings-grid">
            <div className="admin-field">
              <label className="admin-field-label">الاسم</label>
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-field-label">البريد الإلكتروني</label>
              <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-field-label">رقم الهاتف</label>
              <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-field-label">كلمة المرور الجديدة</label>
              <PasswordField
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="اتركها فارغة إذا لا تريد التغيير"
                autoComplete="new-password"
              />
            </div>
          </div>

          <section className="settings-addresses-block">
            <div className="section-head compact">
              <h2>العناوين</h2>
              <button type="button" className="secondary-btn settings-add-address" onClick={() => openAddressEditor()}>
                <Plus size={16} />
                <span>إضافة عنوان</span>
              </button>
            </div>

            {addressEditor.open ? (
              <div className="settings-address-editor">
                <div className="settings-address-toolbar">
                  <strong>{addressEditor.index === null ? 'عنوان جديد' : 'تعديل العنوان'}</strong>
                  <button type="button" className="round-action settings-address-close" onClick={closeAddressEditor}>
                    <X size={18} />
                  </button>
                </div>

                <div className="settings-grid settings-address-grid">
                  <div className="admin-field">
                    <label className="admin-field-label">اسم العنوان</label>
                    <input
                      value={addressEditor.data.label}
                      onChange={(event) => updateAddressDraft('label', event.target.value)}
                      placeholder="مثال: المنزل أو العمل"
                    />
                  </div>

                  <div className="admin-field">
                    <label className="admin-field-label">المحافظة</label>
                    {availableGovernorates.length ? (
                      <select
                        value={addressEditor.data.governorate}
                        onChange={(event) => updateAddressDraft('governorate', event.target.value)}
                      >
                        <option value="">اختر المحافظة</option>
                        {availableGovernorates.map((governorate) => (
                          <option key={governorate.name} value={governorate.name}>{governorate.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={addressEditor.data.governorate}
                        onChange={(event) => updateAddressDraft('governorate', event.target.value)}
                        placeholder="ادخل اسم المحافظة"
                      />
                    )}
                  </div>

                  <div className="admin-field">
                    <label className="admin-field-label">المدينة</label>
                    {availableCities.length ? (
                      <select
                        value={addressEditor.data.city}
                        onChange={(event) => updateAddressDraft('city', event.target.value)}
                        disabled={!addressEditor.data.governorate}
                      >
                        <option value="">اختر المدينة</option>
                        {availableCities.map((cityName) => (
                          <option key={cityName} value={cityName}>{cityName}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={addressEditor.data.city}
                        onChange={(event) => updateAddressDraft('city', event.target.value)}
                        placeholder="ادخل اسم المدينة"
                      />
                    )}
                  </div>

                  <div className="admin-field">
                    <label className="admin-field-label">العنوان التفصيلي</label>
                    <input
                      value={addressEditor.data.street}
                      onChange={(event) => updateAddressDraft('street', event.target.value)}
                      placeholder="الشارع ورقم العقار والدور"
                    />
                  </div>
                </div>

                <div className="admin-field">
                  <label className="admin-field-label">ملاحظات</label>
                  <textarea
                    value={addressEditor.data.notes}
                    onChange={(event) => updateAddressDraft('notes', event.target.value)}
                    placeholder="أي ملاحظات إضافية عن العنوان"
                  />
                </div>

                <div className="settings-inline-actions">
                  <button type="button" className="secondary-btn" onClick={closeAddressEditor}>إلغاء</button>
                  <button type="button" className="primary-btn" onClick={saveAddressDraft}>
                    {addressEditor.index === null ? 'حفظ العنوان' : 'تحديث العنوان'}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="settings-addresses-stack">
              {form.addresses.length ? form.addresses.map((item, index) => (
                <article key={`address-${item._id || index}`} className="settings-address-summary">
                  <div className="settings-address-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="settings-address-copy">
                    <strong>{item.label || `عنوان ${index + 1}`}</strong>
                    <p>{[item.governorate, item.city].filter(Boolean).join(' - ')}</p>
                    <span>{item.street || item.address}</span>
                    {item.notes ? <small>{item.notes}</small> : null}
                  </div>
                  <div className="settings-address-actions">
                    <button type="button" className="table-action-btn edit" onClick={() => openAddressEditor(index)}>
                      <Pencil size={15} />
                      <span>تعديل</span>
                    </button>
                    <button type="button" className="table-action-btn danger" onClick={() => removeAddress(index)}>حذف</button>
                  </div>
                </article>
              )) : (
                <div className="settings-address-empty">
                  <MapPin size={20} />
                  <span>لم تضف أي عنوان بعد</span>
                </div>
              )}
            </div>
          </section>

          <button className="primary-btn settings-save-btn" disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}</button>
        </form>}
    </section>
  </main>;
}
