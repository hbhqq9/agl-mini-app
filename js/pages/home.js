import React from 'react';
import htm from 'htm';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore.js';

const html = htm.bind(React.createElement);

export default function Home() {
  const { user, tgUser } = useAppStore();
  const displayName = tgUser?.first_name || '用户';
  const NavBar = window.__NavBar;

  return html`
    <div class="hero">
      <div class="hero-title">👋 ${displayName}</div>
      <div class="hero-subtitle">Telegram Parasite — 全平台社群运营中心</div>
    </div>

    <div class="feature-grid">
      <${Link} class="feature-card" to="/dashboard">
        <div class="feature-icon">📊</div>
        <div class="feature-label">数据总览</div>
      <//>
      <${Link} class="feature-card" to="/community">
        <div class="feature-icon">💬</div>
        <div class="feature-label">社群管理</div>
      <//>
      <${Link} class="feature-card" to="/meeting">
        <div class="feature-icon">📹</div>
        <div class="feature-label">视频会议</div>
      <//>
      <${Link} class="feature-card" to="/wallet">
        <div class="feature-icon">💎</div>
        <div class="feature-label">TON 钱包</div>
      <//>
    </div>

    <div style="margin-top: 24px">
      <div class="card">
        <div class="card-title">快速入口</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-primary" onClick=${() => {
            const tg = window.Telegram?.WebApp;
            if (tg) tg.sendData(JSON.stringify({action: 'open_bot_menu'}));
          }}>🤖 打开 Bot 菜单</button>
          <button class="btn btn-secondary" onClick=${() => {
            const tg = window.Telegram?.WebApp;
            if (tg) tg.openTelegramLink('https://t.me/');
          }}>💬 加入社群</button>
        </div>
      </div>
    </div>

    <${NavBar} active="home" />
  `;
}
