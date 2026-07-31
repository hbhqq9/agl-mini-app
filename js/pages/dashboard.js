import React, { useEffect } from 'react';
import htm from 'htm';
import { supabase } from '../utils/supabase.js';
import { useAppStore } from '../store/appStore.js';

const html = htm.bind(React.createElement);

export default function Dashboard() {
  const { businessLines, refreshData } = useAppStore();
  const [totalMembers, setTotalMembers] = React.useState(0);
  const [totalCommunities, setTotalCommunities] = React.useState(0);
  const NavBar = window.__NavBar;

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const total = businessLines.reduce((sum, bl) => sum + (bl.member_count || 0), 0);
    setTotalMembers(total);
  }, [businessLines]);

  useEffect(() => {
    async function fetchStats() {
      const { count } = await supabase.from('communities').select('*', { count: 'exact', head: true });
      setTotalCommunities(count || 0);
    }
    fetchStats();
  }, []);

  return html`
    <h2 style="margin-bottom:16px;font-size:20px">📊 数据总览</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${businessLines.length}</div>
        <div class="stat-label">业务线</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totalCommunities}</div>
        <div class="stat-label">社群数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totalMembers}</div>
        <div class="stat-label">总成员</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${businessLines.filter(b => b.status === 'active').length}</div>
        <div class="stat-label">已激活</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">业务线列表</div>
      ${businessLines.map(bl => html`
        <div key=${bl.id} class="business-line-item">
          <div>
            <div class="bl-name">${bl.name}</div>
            <div class="bl-members">${bl.member_count || 0} 成员 · ${bl.description || ''}</div>
          </div>
          <span class=${'bl-badge ' + bl.status}>${bl.status === 'active' ? '活跃' : '待激活'}</span>
        </div>
      `)}
    </div>

    <${NavBar} active="dashboard" />
  `;
}
