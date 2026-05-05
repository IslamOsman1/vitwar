import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { StoreSettingsProvider } from './context/StoreSettingsContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreSettingsProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
              <Toaster position="top-center" />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </StoreSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
