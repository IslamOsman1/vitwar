# Vitwar

Full-stack MERN storefront for **Vitwar**, built for an Arabic RTL sweets and waffle brand.

## Structure

- `client`: Vite + React frontend
- `server`: Express + MongoDB API

## Highlights

- Arabic RTL storefront
- Admin dashboard for products, categories, content, orders, and settings
- Product image uploads
- QR-based customer identity
- Stripe support
- Google login
- Push notifications
- Optional Twilio WhatsApp order updates

## Local Run

```bash
npm run install:all
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api`

## Seed Demo Data

```bash
cd server
npm run seed
```

Demo admin:

- Email: `admin@vitwar.com`
- Password: `12345678`

## Deployment Notes

- Frontend root: `client`
- Backend root: `server`
- Render blueprint file: [render.yaml](render.yaml)
- Health check: `/api/health`

Important environment variables:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `VITE_API_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `STRIPE_SECRET_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `EMAIL_FROM`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
