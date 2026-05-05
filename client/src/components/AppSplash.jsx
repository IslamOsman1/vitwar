import React from 'react';
import Logo from './Logo.jsx';

export default function AppSplash({ visible, routeChanging = false }) {
  return <div className={`app-splash${visible ? ' visible' : ''}${routeChanging ? ' route-changing' : ''}`} aria-hidden={!visible}>
    <div className="app-splash-inner">
      <Logo className="app-splash-logo" compact />
      <div className="app-splash-loader">
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>;
}
