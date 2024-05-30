// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  runAutomation: (data) => ipcRenderer.invoke("run-automation", data),
  resetAutomation: () => ipcRenderer.invoke("reset-automation"),
});
