// 悬浮窗口的 preload 脚本
const { ipcRenderer } = require('electron');

// 接收主窗口发来的设置更新
ipcRenderer.on('update-settings', (event, newSettings) => {
  // 通知页面更新设置
  window.dispatchEvent(new CustomEvent('settings-updated', { detail: newSettings }));
});

// 通知主窗口窗口已就绪
utools.sendToParent('muyu-window-ready', { timestamp: Date.now() });
