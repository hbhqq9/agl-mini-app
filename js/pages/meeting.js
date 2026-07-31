import React, { useEffect, useState } from 'react';
import htm from 'htm';
import { supabase } from '../utils/supabase.js';
import { useAppStore } from '../store/appStore.js';

const html = htm.bind(React.createElement);

export default function Meeting() {
  const { user } = useAppStore();
  const [meetings, setMeetings] = useState([]);
  const [creating, setCreating] = useState(false);
  const NavBar = window.__NavBar;

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    const { data } = await supabase
      .from('meetings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setMeetings(data);
  };

  const createMeeting = async () => {
    setCreating(true);
    const roomId = 'room-' + Date.now().toString(36);
    const jitsiUrl = 'https://meet.jit.si/TeleParasite-' + roomId;
    
    const { error } = await supabase.from('meetings').insert({
      room_id: roomId,
      title: '临时会议 ' + new Date().toLocaleString('zh-CN'),
      jitsi_url: jitsiUrl,
      created_by: user?.id,
      status: 'scheduled',
    });

    if (!error) fetchMeetings();
    setCreating(false);
  };

  const joinMeeting = (url) => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const statusText = (s) => {
    if (s === 'active') return '进行中';
    if (s === 'ended') return '已结束';
    return '待开始';
  };

  return html`
    <h2 style="margin-bottom:16px;font-size:20px">📹 视频会议</h2>

    <div class="card">
      <button class="btn btn-primary" onClick=${createMeeting} disabled=${creating}>
        ${creating ? '创建中...' : '＋ 创建新会议'}
      </button>
    </div>

    ${meetings.length === 0 ? html`
      <div class="empty-state">
        <div class="empty-icon">📹</div>
        <p>暂无会议记录</p>
        <p style="margin-top:8px;font-size:12px">点击上方按钮创建第一个会议</p>
      </div>
    ` : meetings.map(m => html`
      <div key=${m.id} class="meeting-card">
        <div class="meeting-title">${m.title || '未命名会议'}</div>
        <div class="meeting-time">
          ${m.created_at ? new Date(m.created_at).toLocaleString('zh-CN') : ''}
          · ${statusText(m.status)}
          ${m.participant_count > 0 ? ' · ' + m.participant_count + ' 人参与' : ''}
        </div>
        <div class="meeting-actions">
          <button class="btn btn-primary" onClick=${() => joinMeeting(m.jitsi_url)}>
            加入会议
          </button>
          <button class="btn btn-secondary" onClick=${() => {
            if (navigator.clipboard) navigator.clipboard.writeText(m.jitsi_url);
          }}>
            复制链接
          </button>
        </div>
      </div>
    `)}

    <${NavBar} active="meeting" />
  `;
}
