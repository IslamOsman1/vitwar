import React, { useEffect, useState } from 'react';
import { Check, Minus, Plus, Printer, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/api.js';
import { useCart } from '../context/CartContext.jsx';
import { normalizeAddOns } from '../utils/cart.js';

const formatMeasurement = (product) => {
  const value = Number(product?.measurementValue || 0);
  const unit = String(product?.measurementUnit || '').trim();
  return value > 0 && unit ? `${value} ${unit}` : '';
};

const hasTrackedStock = (product) => product?.countInStock !== null && product?.countInStock !== undefined && product?.countInStock !== '';
const isOutOfStock = (product) => hasTrackedStock(product) && Number(product.countInStock) < 1;

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [addOnOptions, setAddOnOptions] = useState([]);
  const [selectedAddOnsMap, setSelectedAddOnsMap] = useState({});
  const [qty, setQty] = useState(1);
  const [qrImage, setQrImage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    let ignore = false;

    api.get(`/products/${id}`)
      .then((productResponse) => {
        if (ignore) return;
        const nextProduct = productResponse.data;
        const nextAddOns = Array.isArray(nextProduct.availableAddOns)
          ? nextProduct.availableAddOns.filter((item) => item?._id && item.active !== false)
          : [];
        setProduct(nextProduct);
        setAddOnOptions(nextAddOns);
      })
      .catch(() => {
        if (ignore) return;
        setProduct(null);
        setAddOnOptions([]);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    setQty(1);
    setSelectedAddOnsMap({});
  }, [product?._id]);

  useEffect(() => {
    const barcode = String(product?.barcode || '').trim();
    if (!barcode) {
      setQrImage('');
      return;
    }

    QRCode.toDataURL(barcode, {
      margin: 1,
      width: 240,
      color: {
        dark: '#111111',
        light: '#FFF7EA'
      }
    })
      .then(setQrImage)
      .catch(() => setQrImage(''));
  }, [product?.barcode]);

  const printQr = () => {
    const barcode = String(product?.barcode || '').trim();
    if (!barcode || !qrImage || !product) {
      toast.error('لا يوجد QR جاهز للطباعة');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=520,height=720');
    if (!printWindow) {
      toast.error('المتصفح منع نافذة الطباعة');
      return;
    }

    printWindow.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>طباعة QR - ${product.name}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;margin:0;color:#111;text-align:center}
      .sheet{max-width:360px;margin:0 auto;border:1px solid #ddd;border-radius:18px;padding:24px}
      img{width:240px;height:240px;display:block;margin:0 auto 18px}
      h1{font-size:24px;margin:0 0 10px}
      p{margin:6px 0;font-size:16px}
      .code{font-weight:700;letter-spacing:.08em}
    </style>
  </head>
  <body>
    <div class="sheet">
      <img src="${qrImage}" alt="QR ${barcode}" />
      <h1>${product.name}</h1>
      <p>${product.category || ''}${product.subcategory ? ` - ${product.subcategory}` : ''}</p>
      <p class="code">${barcode}</p>
    </div>
    <script>
      window.onload = function() {
        window.print();
      };
    </script>
  </body>
</html>`);
    printWindow.document.close();
  };

  if (!product) return <div className="container page"><p>جاري التحميل...</p></div>;

  const measurementLabel = formatMeasurement(product);
  const trackedStock = hasTrackedStock(product);
  const outOfStock = isOutOfStock(product);
  const selectedAddOns = normalizeAddOns(addOnOptions
    .filter((item) => Number(selectedAddOnsMap[item._id] || 0) > 0)
    .map((item) => ({ ...item, qty: selectedAddOnsMap[item._id] })));
  const selectedAddOnsTotal = selectedAddOns.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const incrementAddOn = (addOnId) => {
    setSelectedAddOnsMap((current) => ({
      ...current,
      [addOnId]: Number(current[addOnId] || 0) + 1
    }));
  };

  const decrementAddOn = (addOnId) => {
    setSelectedAddOnsMap((current) => {
      const nextQty = Number(current[addOnId] || 0) - 1;
      const next = { ...current };
      if (nextQty > 0) {
        next[addOnId] = nextQty;
      } else {
        delete next[addOnId];
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    addToCart(product, Math.max(1, Number(qty) || 1), selectedAddOns);
  };

  return (
    <div className="container page">
      <div className="product-details">
        <div className="detail-image">
          {product.image?.url ? <img src={product.image.url} alt={product.name} loading="eager" decoding="async" sizes="(max-width: 768px) 100vw, 48vw" /> : <span>{product.category}</span>}
        </div>

        <div className="detail-info">
          <span className="category">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div className="big-price">
            {product.price + selectedAddOnsTotal} ج.م <small>/ {product.unit}</small>
          </div>
          {selectedAddOnsTotal ? <p className="muted">السعر الأساسي: {product.price} ج.م</p> : null}
          {measurementLabel ? <p className="muted">الحجم: {measurementLabel}</p> : null}
          <p className="muted">المخزون: {trackedStock ? product.countInStock : 'غير محدد'}</p>

          {product.barcode ? (
            <div className="product-detail-qr-card">
              <div className="product-detail-qr-copy">
                <div className="product-detail-qr-head">
                  <QrCode size={18} />
                  <strong>QR المنتج</strong>
                </div>
                <span>{product.barcode}</span>
                <button type="button" className="secondary-btn product-detail-print-btn" onClick={printQr}>
                  <Printer size={16} />
                  <span>طباعة QR</span>
                </button>
              </div>
              <div className="product-detail-qr-box">
                {qrImage ? <img src={qrImage} alt={`QR ${product.barcode}`} loading="lazy" decoding="async" /> : <div className="admin-product-qr-empty">QR</div>}
              </div>
            </div>
          ) : null}

          {addOnOptions.length ? (
            <div className="product-detail-addons">
              <strong>الإضافات</strong>
              <div className="product-detail-addons-list">
                {addOnOptions.map((addOn) => {
                  const disabled = isOutOfStock(addOn);
                  const selectedQty = Number(selectedAddOnsMap[addOn._id] || 0);
                  const checked = selectedQty > 0;
                  return (
                    <div key={addOn._id} className={`product-detail-addon-option${checked ? ' selected' : ''}${disabled ? ' disabled' : ''}`}>
                      <div className="product-detail-addon-controls">
                        <button type="button" onClick={() => incrementAddOn(addOn._id)} disabled={disabled} aria-label="إضافة">
                          <Plus size={18} />
                        </button>
                        {checked ? (
                          <>
                            <span>{selectedQty}</span>
                            <button type="button" onClick={() => decrementAddOn(addOn._id)} aria-label="تقليل">
                              <Minus size={16} />
                            </button>
                          </>
                        ) : (
                          <span className="product-detail-addon-check"><Check size={16} /></span>
                        )}
                      </div>
                      <span className="product-detail-addon-thumb">
                        {addOn.image ? <img src={addOn.image} alt={addOn.name} loading="lazy" decoding="async" /> : null}
                      </span>
                      <div className="product-detail-addon-copy">
                        <strong>{addOn.name}</strong>
                        <small>{addOn.price} ج.م</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <input type="number" min="1" max={trackedStock ? product.countInStock : undefined} value={qty} onChange={(event) => setQty(event.target.value)} />
          <div className="detail-actions">
            <button className="primary-btn" onClick={handleAddToCart} disabled={outOfStock}>أضف للسلة</button>
          </div>
        </div>
      </div>
    </div>
  );
}
