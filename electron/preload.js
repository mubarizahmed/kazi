const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  loadFileTree: () => ipcRenderer.invoke('load-fileTree'),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
},)
