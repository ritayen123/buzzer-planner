'use client';
import { useState, useEffect, useCallback } from 'react';

const WEEKS = [
  { num: 1, label: 'W1', dates: '4/7-4/11', month: 4 },
  { num: 2, label: 'W2', dates: '4/14-4/18', month: 4 },
  { num: 3, label: 'W3', dates: '4/21-4/25', month: 4 },
  { num: 4, label: 'W4', dates: '4/28-5/2', month: 4 },
  { num: 5, label: 'W5', dates: '5/5-5/9', month: 5 },
  { num: 6, label: 'W6', dates: '5/12-5/16', month: 5 },
  { num: 7, label: 'W7', dates: '5/19-5/23', month: 5 },
  { num: 8, label: 'W8', dates: '5/26-5/30', month: 5 },
  { num: 9, label: 'W9', dates: '6/2-6/6', month: 6 },
  { num: 10, label: 'W10', dates: '6/9-6/13', month: 6 },
  { num: 11, label: 'W11', dates: '6/16-6/20', month: 6 },
  { num: 12, label: 'W12', dates: '6/23-6/27', month: 6 },
];

const CHANNELS = [
  { id: 'app-push', name: 'PUSH 推播', group: 'APP', color: '#8B9E3C' },
  { id: 'app-banner', name: 'Banner', group: 'APP', color: '#8B9E3C' },
  { id: 'app-task', name: '上架任務', group: 'APP', color: '#8B9E3C' },
  { id: 'app-shop', name: '商城商品', group: 'APP', color: '#8B9E3C' },
  { id: 'app-game', name: '遊戲', group: 'APP', color: '#8B9E3C' },
  { id: 'app-code', name: '序號發放', group: 'APP', color: '#8B9E3C' },
  { id: 'ig-post', name: '貼文', group: 'IG', color: '#E84073' },
  { id: 'ig-story', name: 'Story', group: 'IG', color: '#E84073' },
  { id: 'facebook', name: 'Facebook', group: 'Facebook', color: '#3B82F6' },
  { id: 'threads', name: 'Threads', group: 'Threads', color: '#1A1A1A' },
  { id: 'dcard', name: 'Dcard', group: 'Dcard', color: '#0E7490' },
];

const GROUPS = ['APP', 'IG', 'Facebook', 'Threads', 'Dcard'];
const GROUP_COLORS = { APP: '#C5D86D', IG: '#FFB6C1', Facebook: '#93B5E0', Threads: '#A09888', Dcard: '#A5B8C7' };
const GROUP_TEXT_COLORS = { APP: '#3D4A1C', IG: '#7A2836', Facebook: '#1E3A5F', Threads: '#333333', Dcard: '#2C4A5A' };

const MONTH_TARGETS = { 4: 200, 5: 700, 6: 800 };
const WEEKLY_TARGETS = {
  1: 50, 2: 50, 3: 50, 4: 50,
  5: 175, 6: 175, 7: 175, 8: 175,
  9: 200, 10: 200, 11: 200, 12: 200,
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getCurrentWeek() {
  const start = new Date('2026-04-07');
  const now = new Date();
  const diff = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
  return Math.min(Math.max(diff + 1, 1), 12);
}

function getDefaultTasks() {
  const t = (week, channel, title) => ({ id: generateId() + Math.random().toString(36).slice(2,4), week, channel, title, completed: false });
  return [
    // W1
    t(1, 'app-shop', '盤點商城庫存，下架過期品項'),
    t(1, 'app-push', '跟開發確認推播提醒機制時程'),
    t(1, 'ig-post', '發 2-3 則貼文'),
    t(1, 'ig-story', '素人私訊 50 人'),
    t(1, 'threads', '發 3-4 則（3:1:1 比例測試，含 1 則軟置入）'),
    // W2
    t(2, 'ig-post', '發 2-3 則貼文'),
    t(2, 'ig-story', '素人私訊 50 人'),
    t(2, 'threads', '發 3-4 則（維持 3:1:1）'),
    t(2, 'dcard', '第一篇（省錢版）'),
    t(2, 'app-push', '持續追推播開發進度'),
    // W3
    t(3, 'ig-post', '發 2-3 則貼文'),
    t(3, 'ig-story', '素人私訊 50 人'),
    t(3, 'threads', '發 3-4 則'),
    t(3, 'facebook', '發第一篇'),
    t(3, 'app-task', '群益對接：確認上線時程＋素材規範'),
    // W4
    t(4, 'ig-post', '發 2-3 則貼文'),
    t(4, 'ig-story', '素人私訊 50 人'),
    t(4, 'threads', '發 3-4 則'),
    t(4, 'dcard', '打工版一篇'),
    t(4, 'app-shop', '製作群益合作預告素材（需群益審核）'),
    t(4, 'app-push', '推薦機制推播通知活躍用戶'),
    // W5
    t(5, 'ig-post', '發 2-3 則貼文'),
    t(5, 'ig-story', '素人私訊 50 人'),
    t(5, 'threads', '發 3-4 則'),
    t(5, 'facebook', '發一篇'),
    t(5, 'app-task', '內部測試群益任務＋公益學堂＋遊戲流程'),
    t(5, 'app-banner', '準備群益上線 Banner'),
    // W6 群益上線週
    t(6, 'ig-post', '5/12 預告 + 5/15 上線公告'),
    t(6, 'ig-story', '素人私訊 50 人（加入群益背書）'),
    t(6, 'threads', '5/12 預告 + 2 則群益 + 1 聊天 + 1 導流'),
    t(6, 'facebook', '5/12 預告'),
    t(6, 'app-push', '5/15 推播全會員：群益任務上線'),
    t(6, 'app-banner', '群益任務首頁 Banner 上架'),
    t(6, 'app-task', '群益任務正式上線'),
    t(6, 'app-code', '群益相關序號發放'),
    // W7
    t(7, 'ig-post', '發 2-3 則 + 轉發素人 UGC'),
    t(7, 'ig-story', '素人私訊 50 人 + 挑 10-15 位發限動'),
    t(7, 'threads', '3:1:1 軟置入用群益任務當素材'),
    t(7, 'dcard', '分享做群益任務的體驗'),
    // W8
    t(8, 'ig-post', '發 2-3 則貼文'),
    t(8, 'ig-story', '素人私訊 50 人'),
    t(8, 'threads', '發 3-4 則（3:1:1）'),
    t(8, 'facebook', '發一篇'),
    // W9
    t(9, 'ig-post', '依數據調整內容方向'),
    t(9, 'ig-story', '依數據調整私訊量（50 或 80 人）'),
    t(9, 'threads', '依數據決定頻率'),
    t(9, 'dcard', '發一篇'),
    t(9, 'app-push', '推薦加碼活動推播'),
    // W10
    t(10, 'ig-post', '發 2-3 則貼文'),
    t(10, 'ig-story', '持續素人私訊'),
    t(10, 'threads', '依調整策略執行'),
    t(10, 'facebook', '發一篇'),
    t(10, 'app-push', '沉睡喚醒推播（7天未開App）'),
    // W11
    t(11, 'ig-post', '發 2-3 則貼文'),
    t(11, 'ig-story', '持續素人私訊'),
    t(11, 'threads', '依調整策略執行'),
    t(11, 'dcard', '發一篇'),
    // W12
    t(12, 'ig-post', '發 2-3 則貼文'),
    t(12, 'ig-story', '持續素人私訊'),
    t(12, 'threads', '依調整策略執行'),
    t(12, 'facebook', '發一篇'),
  ];
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [activeTab, setActiveTab] = useState('planning');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kvReady, setKvReady] = useState(false);
  const [collapsed, setCollapsed] = useState({});
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const currentWeek = getCurrentWeek();

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      setKvReady(data.kvReady || false);
      if (data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks);
        setMetrics(data.metrics || {});
      } else {
        const saved = localStorage.getItem('buzzer-planner');
        if (saved) {
          const local = JSON.parse(saved);
          setTasks(local.tasks?.length > 0 ? local.tasks : getDefaultTasks());
          setMetrics(local.metrics || {});
        } else {
          setTasks(getDefaultTasks());
        }
      }
    } catch {
      const saved = localStorage.getItem('buzzer-planner');
      if (saved) {
        const local = JSON.parse(saved);
        setTasks(local.tasks?.length > 0 ? local.tasks : getDefaultTasks());
        setMetrics(local.metrics || {});
      } else {
        setTasks(getDefaultTasks());
      }
    }
    setLoading(false);
  }

  const saveData = useCallback(async (newTasks, newMetrics) => {
    const data = { tasks: newTasks, metrics: newMetrics, updatedAt: new Date().toISOString() };
    localStorage.setItem('buzzer-planner', JSON.stringify(data));
    setSaving(true);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {}
    setSaving(false);
    setLastSaved(new Date().toLocaleTimeString('zh-TW'));
  }, []);

  function toggleTask(id) {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    saveData(updated, metrics);
  }

  function addTask(week, channel) {
    setModal({ mode: 'add', week, channel, title: '', description: '' });
  }

  function editTask(task) {
    setModal({ mode: 'edit', ...task });
  }

  function saveModal() {
    if (!modal.title.trim()) return;
    let updated;
    if (modal.mode === 'add') {
      const newTask = { id: generateId(), week: modal.week, channel: modal.channel, title: modal.title.trim(), description: modal.description || '', completed: false };
      updated = [...tasks, newTask];
    } else {
      updated = tasks.map(t => t.id === modal.id ? { ...t, title: modal.title.trim(), description: modal.description || '' } : t);
    }
    setTasks(updated);
    saveData(updated, metrics);
    setModal(null);
  }

  function deleteTask() {
    if (!confirm('確定要刪除這個項目嗎？')) return;
    const updated = tasks.filter(t => t.id !== modal.id);
    setTasks(updated);
    saveData(updated, metrics);
    setModal(null);
  }

  function updateMetric(week, field, value) {
    const num = value === '' ? '' : Number(value);
    const updated = { ...metrics, [week]: { ...(metrics[week] || {}), [field]: num } };
    setMetrics(updated);
    saveData(tasks, updated);
  }

  function resetData() {
    if (!confirm('確定要重置所有資料嗎？這會清除所有修改。')) return;
    const defaultTasks = getDefaultTasks();
    setTasks(defaultTasks);
    setMetrics({});
    saveData(defaultTasks, {});
  }

  function toggleGroup(group) {
    setCollapsed(prev => ({ ...prev, [group]: !prev[group] }));
  }

  function getTasksForCell(week, channelId) {
    return tasks.filter(t => t.week === week && t.channel === channelId);
  }

  function generateInsights() {
    const insights = [];
    const hasData = Object.values(metrics).some(m => m && Object.values(m).some(v => v !== '' && v > 0));
    if (!hasData) {
      return [{ type: 'info', title: '尚無數據', text: '開始在「數據追蹤」分頁回填每週數據後，系統會自動產生分析建議。' }];
    }

    // Member growth
    let totalNew = 0;
    for (let w = 1; w <= currentWeek; w++) {
      totalNew += Number(metrics[w]?.newMembers || 0);
    }
    let expectedTotal = 0;
    for (let w = 1; w <= currentWeek; w++) {
      expectedTotal += WEEKLY_TARGETS[w];
    }

    if (totalNew >= expectedTotal) {
      insights.push({ type: 'success', title: '會員成長達標', text: `累計新增 ${totalNew} 人，目標 ${expectedTotal} 人。持續保持！` });
    } else if (totalNew >= expectedTotal * 0.7) {
      insights.push({ type: 'warning', title: '會員成長略低', text: `累計新增 ${totalNew} 人，目標 ${expectedTotal} 人（達成 ${Math.round(totalNew/expectedTotal*100)}%）。建議加碼 IG 私訊量或增加 Dcard/FB 發文。` });
    } else if (totalNew > 0) {
      insights.push({ type: 'danger', title: '會員成長落後', text: `累計新增 ${totalNew} 人，目標 ${expectedTotal} 人（僅達成 ${Math.round(totalNew/expectedTotal*100)}%）。需要調整策略：增加私訊量、嘗試新渠道、或優化轉換流程。` });
    }

    // Redemption rate
    const latestWeekWithData = [...Array(currentWeek)].map((_, i) => i + 1).reverse().find(w => metrics[w]?.redemptions > 0);
    if (latestWeekWithData) {
      const redemptions = Number(metrics[latestWeekWithData]?.redemptions || 0);
      const taskCompletions = Number(metrics[latestWeekWithData]?.taskCompletions || 0);
      if (taskCompletions > 0 && redemptions / taskCompletions < 0.3) {
        insights.push({ type: 'warning', title: '商城兌換率偏低', text: `W${latestWeekWithData} 任務完成 ${taskCompletions} 次，但只有 ${redemptions} 次兌換。用戶做完任務不去換，建議優化兌換提醒推播。` });
      }
    }

    // IG reply rate
    const weeksWithIG = [...Array(currentWeek)].map((_, i) => i + 1).filter(w => metrics[w]?.igDmSent > 0);
    if (weeksWithIG.length >= 2) {
      const rates = weeksWithIG.map(w => (metrics[w]?.igDmReply || 0) / (metrics[w]?.igDmSent || 1) * 100);
      const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
      if (avgRate < 10) {
        insights.push({ type: 'warning', title: 'IG 私訊回覆率低', text: `平均回覆率 ${avgRate.toFixed(1)}%。建議調整私訊話術，或改從 Threads 互動後再私訊。` });
      } else if (avgRate >= 20) {
        insights.push({ type: 'success', title: 'IG 私訊效果好', text: `平均回覆率 ${avgRate.toFixed(1)}%，高於一般水準。可考慮加量到 80 人/週。` });
      }
    }

    // Threads engagement
    const weeksWithThreads = [...Array(currentWeek)].map((_, i) => i + 1).filter(w => metrics[w]?.threadsEngagement > 0);
    if (weeksWithThreads.length >= 3) {
      const recent = weeksWithThreads.slice(-2).map(w => metrics[w]?.threadsEngagement || 0);
      const earlier = weeksWithThreads.slice(0, -2).map(w => metrics[w]?.threadsEngagement || 0);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
      if (recentAvg < earlierAvg * 0.7) {
        insights.push({ type: 'warning', title: 'Threads 互動下降', text: `近期互動數下降，考慮是否需要調整內容比例或減少 Threads 投入。` });
      }
    }

    // Task completion progress
    const completedCount = tasks.filter(t => t.week <= currentWeek && t.completed).length;
    const totalCount = tasks.filter(t => t.week <= currentWeek).length;
    if (totalCount > 0) {
      const rate = Math.round(completedCount / totalCount * 100);
      if (rate >= 80) {
        insights.push({ type: 'success', title: '執行進度良好', text: `已完成 ${completedCount}/${totalCount} 項任務（${rate}%），執行力很好！` });
      } else if (rate < 50) {
        insights.push({ type: 'danger', title: '執行進度落後', text: `僅完成 ${completedCount}/${totalCount} 項任務（${rate}%）。建議優先完成本週任務，並檢視是否有需要刪除的不切實際項目。` });
      }
    }

    if (insights.length === 0) {
      insights.push({ type: 'info', title: '數據不足', text: '持續回填數據，累積 2-3 週後會有更精準的分析。' });
    }

    return insights;
  }

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  return (
    <>
      <header className="header">
        <h1>Buzzer 行銷規劃看板</h1>
        <div className="header-nav">
          <button className={activeTab === 'planning' ? 'active' : ''} onClick={() => setActiveTab('planning')}>規劃</button>
          <button className={activeTab === 'metrics' ? 'active' : ''} onClick={() => setActiveTab('metrics')}>數據追蹤</button>
          <button onClick={resetData} style={{opacity: 0.7, fontSize: 12}}>重置</button>
        </div>
      </header>

      <div className="status-bar">
        <div className="sync-status">
          <span className={`sync-dot ${kvReady ? 'online' : 'offline'}`}></span>
          {kvReady ? '已連線（多人同步）' : '本機模式（localStorage）'}
        </div>
        <div>
          {saving ? '儲存中...' : lastSaved ? `上次儲存 ${lastSaved}` : ''}
          {' '}| 目前第 W{currentWeek} 週
        </div>
      </div>

      {activeTab === 'planning' && (
        <div className="timeline-wrapper">
          {/* Month headers */}
          <div className="month-row">
            <div className="corner-cell"></div>
            <div className="month-label apr" style={{gridColumn: 'span 4'}}>4 月</div>
            <div className="month-label may" style={{gridColumn: 'span 4'}}>5 月</div>
            <div className="month-label jun" style={{gridColumn: 'span 4'}}>6 月</div>
          </div>

          {/* Week headers */}
          <div className="week-row">
            <div className="corner-cell">渠道</div>
            {WEEKS.map(w => (
              <div key={w.num} className={`week-label ${w.num === currentWeek ? 'current' : ''}`}>
                {w.label}
                <small>{w.dates}</small>
                {w.num === 6 && <small style={{color: '#f44336', fontWeight: 600}}>群益上線</small>}
              </div>
            ))}
          </div>

          {/* Channel rows */}
          {GROUPS.map(group => {
            const groupChannels = CHANNELS.filter(c => c.group === group);
            const isCollapsed = collapsed[group];
            const isSingle = groupChannels.length === 1;

            return (
              <div key={group}>
                {/* Group header */}
                <div className="channel-group-header">
                  <div className="group-label" style={{background: GROUP_COLORS[group], color: GROUP_TEXT_COLORS[group]}} onClick={() => !isSingle && toggleGroup(group)}>
                    {!isSingle && <span className={`arrow ${isCollapsed ? 'collapsed' : ''}`}>▼</span>}
                    {group}
                  </div>
                  {isSingle ? (
                    WEEKS.map(w => {
                      const cellTasks = getTasksForCell(w.num, groupChannels[0].id);
                      return (
                        <div key={w.num} className={`task-cell ${w.num === currentWeek ? 'current-week' : ''}`}>
                          {cellTasks.map(task => (
                            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
                              <span className="task-title" onClick={() => editTask(task)}>{task.title}</span>
                            </div>
                          ))}
                          <button className="add-task-btn" onClick={() => addTask(w.num, groupChannels[0].id)}>+ 新增</button>
                        </div>
                      );
                    })
                  ) : (
                    WEEKS.map(w => {
                      const allTasks = groupChannels.flatMap(c => getTasksForCell(w.num, c.id));
                      const done = allTasks.filter(t => t.completed).length;
                      return (
                        <div key={w.num} className={`task-cell ${w.num === currentWeek ? 'current-week' : ''}`} style={{fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          {allTasks.length > 0 && `${done}/${allTasks.length}`}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Sub-channel rows */}
                {!isSingle && !isCollapsed && groupChannels.map(ch => (
                  <div key={ch.id} className="channel-row">
                    <div className="channel-label">
                      <span className="dot" style={{background: ch.color}}></span>
                      {ch.name}
                    </div>
                    {WEEKS.map(w => {
                      const cellTasks = getTasksForCell(w.num, ch.id);
                      return (
                        <div key={w.num} className={`task-cell ${w.num === currentWeek ? 'current-week' : ''}`}>
                          {cellTasks.map(task => (
                            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
                              <span className="task-title" onClick={() => editTask(task)}>{task.title}</span>
                            </div>
                          ))}
                          <button className="add-task-btn" onClick={() => addTask(w.num, ch.id)}>+</button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="metrics-wrapper">
          {/* KPI Summary */}
          <div className="kpi-grid">
            {(() => {
              let totalNew = 0;
              for (let w = 1; w <= 12; w++) totalNew += Number(metrics[w]?.newMembers || 0);
              let expectedTotal = 0;
              for (let w = 1; w <= currentWeek; w++) expectedTotal += WEEKLY_TARGETS[w];
              const targetTotal = 1700;
              const progress = Math.min(totalNew / targetTotal * 100, 100);
              const progressColor = totalNew >= expectedTotal ? '#4CAF50' : totalNew >= expectedTotal * 0.7 ? '#FF9800' : '#f44336';

              return (
                <>
                  <div className="kpi-card">
                    <div className="kpi-value">{800 + totalNew}</div>
                    <div className="kpi-label">目前總會員數</div>
                    <div className="progress-bar"><div className="progress-fill" style={{width: `${progress}%`, background: progressColor}}></div></div>
                    <div className="kpi-target">目標 2,500-3,500</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-value">{totalNew}</div>
                    <div className="kpi-label">累計新增會員</div>
                    <div className="kpi-target">本週目標累計 {expectedTotal}</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-value">
                      {tasks.filter(t => t.week <= currentWeek && t.completed).length}/{tasks.filter(t => t.week <= currentWeek).length}
                    </div>
                    <div className="kpi-label">任務執行進度</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${tasks.filter(t => t.week <= currentWeek).length > 0 ? tasks.filter(t => t.week <= currentWeek && t.completed).length / tasks.filter(t => t.week <= currentWeek).length * 100 : 0}%`,
                        background: '#7B9E3C'
                      }}></div>
                    </div>
                    <div className="kpi-target">已完成/總計（至本週）</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-value" style={{fontSize: 24}}>W{currentWeek}</div>
                    <div className="kpi-label">目前進度</div>
                    <div className="kpi-target">{WEEKS[currentWeek-1]?.dates}</div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Weekly Metrics Input */}
          <div className="metrics-section">
            <h2>每週數據回填</h2>
            <div style={{overflowX: 'auto'}}>
              <table className="metrics-table">
                <thead>
                  <tr>
                    <th>週次</th>
                    <th>新會員數</th>
                    <th>任務完成數</th>
                    <th>商城兌換數</th>
                    <th>IG 私訊發送</th>
                    <th>IG 私訊回覆</th>
                    <th>Threads 互動數</th>
                    <th>備註</th>
                  </tr>
                  <tr className="target-row">
                    <td>目標</td>
                    <td colSpan={7} style={{textAlign: 'left', paddingLeft: 12}}>
                      4月每週 50 人 | 5月每週 175 人 | 6月每週 200 人
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {WEEKS.map(w => {
                    const m = metrics[w.num] || {};
                    const target = WEEKLY_TARGETS[w.num];
                    const newMembers = Number(m.newMembers || 0);
                    const memberClass = m.newMembers !== undefined && m.newMembers !== '' ? (newMembers >= target ? 'above-target' : 'below-target') : '';

                    return (
                      <tr key={w.num} style={w.num === currentWeek ? {background: '#FFFDE7'} : {}}>
                        <td className="week-col">
                          {w.label}
                          <br/><span style={{fontSize: 11, fontWeight: 400, color: '#888'}}>{w.dates}</span>
                        </td>
                        <td className={memberClass}>
                          <input type="number" value={m.newMembers ?? ''} placeholder={`目標${target}`} onChange={e => updateMetric(w.num, 'newMembers', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" value={m.taskCompletions ?? ''} placeholder="-" onChange={e => updateMetric(w.num, 'taskCompletions', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" value={m.redemptions ?? ''} placeholder="-" onChange={e => updateMetric(w.num, 'redemptions', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" value={m.igDmSent ?? ''} placeholder="50" onChange={e => updateMetric(w.num, 'igDmSent', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" value={m.igDmReply ?? ''} placeholder="-" onChange={e => updateMetric(w.num, 'igDmReply', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" value={m.threadsEngagement ?? ''} placeholder="-" onChange={e => updateMetric(w.num, 'threadsEngagement', e.target.value)} />
                        </td>
                        <td>
                          <input type="text" value={m.notes ?? ''} placeholder="備註" style={{textAlign: 'left'}} onChange={e => updateMetric(w.num, 'notes', e.target.value)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights */}
          <div className="metrics-section">
            <h2>分析與建議</h2>
            {generateInsights().map((insight, i) => (
              <div key={i} className={`insight-card ${insight.type}`}>
                <div className="insight-label">{insight.title}</div>
                <div>{insight.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-content">
            <h3>{modal.mode === 'add' ? '新增項目' : '編輯項目'}</h3>
            <label>渠道</label>
            <input value={CHANNELS.find(c => c.id === modal.channel)?.group + ' / ' + CHANNELS.find(c => c.id === modal.channel)?.name} disabled style={{background: '#f5f5f5'}} />
            <label>週次</label>
            <input value={`W${modal.week} (${WEEKS[modal.week - 1]?.dates})`} disabled style={{background: '#f5f5f5'}} />
            <label>內容</label>
            <input autoFocus value={modal.title} onChange={e => setModal({...modal, title: e.target.value})} placeholder="輸入任務內容" onKeyDown={e => e.key === 'Enter' && saveModal()} />
            <label>備註</label>
            <textarea value={modal.description || ''} onChange={e => setModal({...modal, description: e.target.value})} placeholder="選填" />
            <div className="modal-actions">
              {modal.mode === 'edit' && <button className="btn btn-danger" onClick={deleteTask}>刪除</button>}
              <button className="btn btn-ghost" onClick={() => setModal(null)}>取消</button>
              <button className="btn btn-primary" onClick={saveModal}>儲存</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
