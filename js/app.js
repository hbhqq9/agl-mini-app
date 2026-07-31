import React from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore.js';
import { useTelegram } from './hooks/useTelegram.js';
import Home from './pages/home.js';
import Dashboard from './pages/dashboard.js';
import Wallet from './pages/wallet.js';
import Community from './pages/community.js';
import Meeting from './pages/meeting.js';

const html = htm.bind(React.createElement);

function NavBar({ active }) {
  return html`
    <nav class="bottom-nav">
      <a class=${'nav-item' + (active === 'home' ? ' active' : '')} href="#/">
        <span class="nav-icon">🏠</span><span>首页</span>
      </a>
      <a class=${'nav-item' + (active === 'dashboard' ? ' active' : '')} href="#/dashboard">
        <span class="nav-icon">📊</span><span>数据</span>
      </a>
      <a class=${'nav-item' + (active === 'community' ? ' active' : '')} href="#/community">
        <span class="nav-icon">💬</span><span>社群</span>
      </a>
      <a class=${'nav-item' + (active === 'wallet' ? ' active' : '')} href="#/wallet">
        <span class="nav-icon">💎</span><span>钱包</span>
      </a>
      <a class=${'nav-item' + (active === 'meeting' ? ' active' : '')} href="#/meeting">
        <span class="nav-icon">📹</span><span>会议</span>
      </a>
    </nav>
  `;
}

function App() {
  const { init, initialized } = useAppStore();
  const tg = useTelegram();

  React.useEffect(() => {
    init(tg);
  }, []);

  if (!initialized) {
    return html`<div class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>`;
  }

  return html`
    <${HashRouter}>
      <${Routes}>
        <${Route} path="/" element=${html`<${Home}/>`} />
        <${Route} path="/dashboard" element=${html`<${Dashboard}/>`} />
        <${Route} path="/wallet" element=${html`<${Wallet}/>`} />
        <${Route} path="/community" element=${html`<${Community}/>`} />
        <${Route} path="/meeting" element=${html`<${Meeting}/>`} />
        <${Route} path="*" element=${html`<${Navigate} to="/"/>`} />
      <//>
    <//>
  `;
}

// Export NavBar for use in pages
window.__NavBar = NavBar;
window.__html = html;

const root = createRoot(document.getElementById('root'));
root.render(html`<${App}/>`);
