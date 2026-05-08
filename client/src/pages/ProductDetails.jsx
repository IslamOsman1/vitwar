import React, { useEffect, useState } from 'react';
import { Heart, Printer, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [qrImage, setQrImage] = useState('');
  const { addToCart } = useCart();
  const { isFavorite, toggleWishlist } = useWishlist();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

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

  const favorite = isFavorite(product._id);

  return <div className="container page product-details">
    <div className="detail-image">{product.image?.url ? <img src={product.image.url} alt={product.name} /> : <span>{product.category}</span>}</div>
    <div className="detail-info">
      <span className="category">{product.category}</span><h1>{product.name}</h1><p>{product.description}</p>
      <div className="big-price">{product.price} ج.م <small>/ {product.unit}</small></div>
      <p className="muted">المخزون: {product.countInStock}</p>

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
            {qrImage ? <img src={qrImage} alt={`QR ${product.barcode}`} /> : <div className="admin-product-qr-empty">QR</div>}
          </div>
        </div>
      ) : null}

      <input type="number" min="1" max={product.countInStock} value={qty} onChange={e => setQty(e.target.value)} />
      <div className="detail-actions">
        <button className="primary-btn" onClick={() => addToCart(product, Number(qty))}>أضف للسلة</button>
        <button type="button" className={`wishlist-detail-btn${favorite ? ' active' : ''}`} onClick={() => toggleWishlist(product)}>
          <Heart size={18} /> {favorite ? 'في المفضلة' : 'أضف للمفضلة'}
        </button>
      </div>
    </div>
  </div>;
}
