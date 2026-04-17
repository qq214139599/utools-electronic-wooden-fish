const { ipcRenderer } = require("electron");

// 数据存储工具
window.muyuDB = {
  // 获取设置
  getSettings() {
    const defaults = {
      volume: 0.7,
      skin: 'classic',
      sound: 'default',
      autoInterval: 0, // 0 = 关闭
      reminderInterval: 0, // 0 = 关闭
      customSoundPath: null,
      hotkey: 'Space'
    };
    const saved = utools.dbStorage.getItem('muyu_settings');
    return saved ? { ...defaults, ...saved } : defaults;
  },

  // 保存设置
  saveSettings(settings) {
    utools.dbStorage.setItem('muyu_settings', settings);
  },

  // 获取今日统计
  getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    const stats = utools.dbStorage.getItem('muyu_stats_' + today) || { count: 0, records: [] };
    return stats;
  },

  // 增加今日计数
  addTodayCount() {
    const today = new Date().toISOString().split('T')[0];
    const stats = this.getTodayStats();
    stats.count++;
    stats.records.push(Date.now());
    utools.dbStorage.setItem('muyu_stats_' + today, stats);
    return stats.count;
  },

  // 获取历史统计
  getHistoryStats(days = 30) {
    const result = { daily: [], weekly: 0, monthly: 0, total: 0 };
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const stats = utools.dbStorage.getItem('muyu_stats_' + dateStr) || { count: 0 };

      result.daily.push({ date: dateStr, count: stats.count });
      result.total += stats.count;

      if (i < 7) result.weekly += stats.count;
      if (i < 30) result.monthly += stats.count;
    }

    return result;
  },

  // 获取所有日期的统计数据
  getAllStats() {
    const stats = {};
    const allData = utools.dbStorage.getAll();
    for (const key of Object.keys(allData)) {
      if (key.startsWith('muyu_stats_')) {
        const date = key.replace('muyu_stats_', '');
        stats[date] = allData[key];
      }
    }
    return stats;
  }
};

// 接收悬浮窗口发来的消息
ipcRenderer.on("muyu-knock", (event, data) => {
  console.log("功德 +1, 总计:", data?.count);
  // 转发到页面
  window.dispatchEvent(new CustomEvent('muyu-knock-event', { detail: data }));
});

ipcRenderer.on("muyu-close", () => {
  console.log("木鱼窗口已关闭");
  window.dispatchEvent(new CustomEvent('muyu-close-event'));
});

ipcRenderer.on("muyu-window-ready", (event, data) => {
  console.log("悬浮窗口就绪:", data);
});
