import React from 'react';
import splashImage from '../assets/splash.png';

export default function AppSplash({ visible, routeChanging = false }) {
  return <div className={`app-splash${visible ? ' visible' : ''}${routeChanging ? ' route-changing' : ''}`} aria-hidden={!visible}>
    <div className="app-splash-inner">
      <img src={splashImage} alt="Burger El Khawaga splash" className="app-splash-logo" />
      <strong className="app-splash-title">Burger El Khawaga</strong>
      <div className="app-splash-loader">
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>;
}
