// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const dirTree = require("directory-tree");
const fs = require('fs');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: true,
    titleBarStyle: 'hidden',
    // titleBarOverlay: true,rs
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  if (app.isPackaged) {
    mainWindow.loadFile('index.html'); // prod
  } else {
    mainWindow.loadURL('http://localhost:5173'); // dev
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('load-fileTree', loadFileTree);
  ipcMain.handle('load-file', loadFile);
  ipcMain.handle('save-file', saveFile);

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const directorySort = (a, b) => {
  if (a.type === 'directory' && b.type === 'file') {
    return -1;
  } else if (a.type === 'file' && b.type === 'directory') {
    return 1;
  } else {
    return a.name.localeCompare(b.name);
  }
};

const treeSort = (tree) => {
  if (tree.children) {
    tree.children.sort(directorySort).forEach(treeSort);
  }
  return tree;
};

const loadFileTree = () => {
  const fileTree = dirTree("/home/mebza/kazi/", { extensions: /\.md$/, attributes: ['type'] });
  console.log(fileTree);
  
  return treeSort(fileTree);
}

function loadFile(event, filePath) {
  console.log("loadFile");
  console.log(filePath);
  var res;
  res = fs.readFileSync(filePath,{encoding: 'utf-8'}).toString();
  return res;
}

function saveFile(event, filePath, content) {
  console.log("saveFile");
  console.log(filePath);
  console.log(content);
  fs.writeFileSync(filePath,content, function (err) {
    if (err) return console.log(err);
  }
  );
}