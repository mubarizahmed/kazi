const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  loadFileTree: () => ipcRenderer.invoke('load-fileTree'),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath)
},)
