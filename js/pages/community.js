import React, { useEffect } from 'react';
import htm from 'htm';
import { useAppStore } from '../store/appStore.js';

const html = htm.bind(React.createElement);

export default function Community() {
  const { businessLines, communities, refreshData } = useAppStore();
  const NavBar = window.__NavBar;

  useEffect(() => {
    refreshData();
  }, []);

  const openGroup = (communityId) => {
    const tg = window.Telegram?.WebApp;
    if (tg && communityId) {
      tg.openTelegramLink('https://t.me/' + communityId);
    }
  };

  return html`
    <h2 style="margin-bottom:16px;font-size:20px">💬 社群管理</h2>

    <div class="card">
      <div class="card-title">我的业务线社群</div>
      ${businessLines.length === 0 ? html`
        <div class="empty-state">
          <div class="empty-icon">💬</div>
          <p>暂无社群数据</p>
        </div>
      ` : businessLines.map(bl => html`
        <div key=${bl.id} class="community-item" onClick=${() => openGroup(bl.telegram_community_id)}>
          <div class="community-avatar">${bl.name[0]}</div>
          <div class="community-info">
            <div class="community-name">${bl.name}</div>
            <div class="community-desc">${bl.description || '暂无描述'} · ${bl.member_count || 0} 成员</div>
          </div>
          <span style="color:var(--tg-theme-hint-color)">→</span>
        </div>
      `)}
    </div>

    ${communities.length > 0 && html`
      <div class="card">
        <div class="card-title">活跃社群</div>
        ${communities.map(c => html`
          <div key=${c.id} class="community-item" onClick=${() => openGroup(c.telegram_group_id)}>
            <div class="community-avatar">${c.name[0]}</div>
            <div class="community-info">
              <div class="community-name">${c.name}</div>
              <div class="community-desc">${c.type === 'channel' ? '频道' : '群组'} · ${c.member_count || 0} 成员</div>
            </div>
            <span style="color:var(--tg-theme-hint-color)">→</span>
          </div>
        `)}
      </div>
    `}

    <${NavBar} active="community" />
  `;
}
