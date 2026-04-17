// 悬浮窗口的 preload 脚本
const { ipcRenderer } = require('electron');

// 接收主窗口发来的设置更新
ipcRenderer.on('settings-updated', (event, newSettings) => {
  console.log('[preload] 收到设置更新:', newSettings);

  // 通过 CustomEvent 通知页面
  window.dispatchEvent(new CustomEvent('settings-updated', {
    detail: newSettings
  }));
});

// 通知主窗口窗口已就绪
if (window.utools) {
  utools.sendToParent('muyu-window-ready', { timestamp: Date.now() });
}
