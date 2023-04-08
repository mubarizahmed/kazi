const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  loadFileTree: () => ipcRenderer.invoke('load-fileTree')
})