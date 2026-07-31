import React, { useState } from 'react';
import htm from 'htm';
import { TonConnectUI } from '@tonconnect/ui';

const html = htm.bind(React.createElement);

let tonConnect;
try {
  tonConnect = new TonConnectUI({
    manifestUrl: '/public/tonconnect-manifest.json',
  });
} catch(e) {
  console.warn('TON Connect init failed:', e);
}

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const NavBar = window.__NavBar;

  const connectWallet = async () => {
    if (!tonConnect) return;
    setConnecting(true);
    try {
      await tonConnect.connectWallet();
      const w = tonConnect.wallet;
      if (w) {
        setWallet({
          address: w.account.address,
          name: w.device?.appName || 'TON Wallet',
        });
      }
    } catch (e) {
      console.error('Wallet connect error:', e);
    }
    setConnecting(false);
  };

  const disconnectWallet = async () => {
    if (!tonConnect) return;
    await tonConnect.disconnect();
    setWallet(null);
  };

  return html`
    <h2 style="margin-bottom:16px;font-size:20px">💎 TON 钱包</h2>

    <div class="card">
      ${wallet ? html`
        <div class="wallet-status">
          <div class="wallet-icon">✅</div>
          <div style="font-size:16px;font-weight:600;margin-bottom:4px">${wallet.name}</div>
          <div class="wallet-address">${wallet.address}</div>
        </div>
        <button class="btn btn-secondary" onClick=${disconnectWallet}>断开连接</button>
      ` : html`
        <div class="wallet-status">
          <div class="wallet-icon">💎</div>
          <div style="font-size:16px;font-weight:600;margin-bottom:4px">连接 TON 钱包</div>
          <p style="font-size:13px;color:var(--tg-theme-hint-color);margin-bottom:16px">
            连接您的 TON 钱包以使用平台功能
          </p>
        </div>
        <button class="btn btn-primary" onClick=${connectWallet} disabled=${connecting}>
          ${connecting ? '连接中...' : '连接钱包'}
        </button>
      `}
    </div>

    <${NavBar} active="wallet" />
  `;
}
