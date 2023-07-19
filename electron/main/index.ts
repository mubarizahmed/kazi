import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { update } from './update';
import { FileTreeType } from '@/types';
import {startTaskScan} from './taskScanner';
const path = require('path');
const dirTree = require('directory-tree');
const fs = require('fs');
const Store = require('electron-store');

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(process.env.DIST_ELECTRON, '../public')
	: process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

// store stuff
const store = new Store({
	// We'll call our data file 'user-preferences'
	configName: 'user-preferences',
	defaults: {
		// 800x600 is the default size of our window
		windowBounds: { width: 800, height: 600, x: 0, y: 0 },
		windowFullScreen: false,
		userDirectory: path.join(app.getPath('documents'), 'Kazi'),
		zoomFactor: 1
	}
});

function loadSettings() {
	return store.store;
}

function changeUserDirectory(){
	dialog.showOpenDialog(win, {
		properties: ['openDirectory']
	}).then(result => {
		if (!result.canceled) {
			console.log(result.filePaths[0]);
			store.set('userDirectory', result.filePaths[0]);
		}
	});
	return store.store;
}

async function createWindow() {
	win = new BrowserWindow({
		title: 'Main window',
		icon: join(process.env.PUBLIC, 'favicon.ico'),
		autoHideMenuBar: true,
		width: store.get('windowBounds.width'),
		height: store.get('windowBounds.height'),
		x: store.get('windowBounds.x'),
		y: store.get('windowBounds.y'),
		fullscreen: store.get('windowFullScreen'),


		webPreferences: {
			preload,
			// Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
			// Consider using contextBridge.exposeInMainWorld
			// Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
			nodeIntegration: true,
			contextIsolation: true,
      zoomFactor: store.get('zoomFactor'),
		}
	});

	if (url) {
		// electron-vite-vue#298
		win.loadURL(url);
		// Open devTool if the app is not packaged
		win.webContents.openDevTools();
	} else {
		win.loadFile(indexHtml);
	}

	// Test actively push message to the Electron-Renderer
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString());
	});

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url);
		return { action: 'deny' };
	});

	// Apply electron-updater
	update(win);

	win.on('close', () => {
		if (win) {
			store.set('windowBounds', win.getBounds());
			store.set('windowLocation', win.getPosition());
			store.set('windowFullScreen', win.isFullScreen());
      store.set('zoomFactor', win.webContents.getZoomFactor());
		}
	});
}

app.whenReady().then(() => {
	ipcMain.handle('load-fileTree', loadFileTree);
	ipcMain.handle('load-file', loadFile);
	ipcMain.handle('save-file', saveFile);
	ipcMain.handle('load-settings', loadSettings);
	ipcMain.handle('change-user-directory', changeUserDirectory);
	ipcMain.handle('start-task-scan', startTaskScan);

	createWindow();
});

app.on('window-all-closed', () => {
	win = null;
	if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
	if (win) {
		// Focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore();
		win.focus();
	}
});

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		createWindow();
	}
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
	const childWindow = new BrowserWindow({
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		childWindow.loadURL(`${url}#${arg}`);
	} else {
		childWindow.loadFile(indexHtml, { hash: arg });
	}
});

const directorySort = (a: FileTreeType, b: FileTreeType) => {
	if (a.type === 'directory' && b.type === 'file') {
		return -1;
	} else if (a.type === 'file' && b.type === 'directory') {
		return 1;
	} else {
		return a.name.localeCompare(b.name);
	}
};

const treeSort = (tree: FileTreeType) => {
	if (tree.children) {
		tree.children.sort(directorySort).forEach(treeSort);
	}
	return tree;
};

const loadFileTree = () => {
  fs.access(store.get('userDirectory'), (err: string) => {
    console.log(err ? 'no dir' : 'dir exists');
    fs.mkdirSync(store.get('userDirectory'), { recursive: true });
  });
	const fileTree = dirTree(store.get('userDirectory'), { extensions: /\.md$/, attributes: ['type'] });
	console.log(fileTree);

	return treeSort(fileTree);
};

function loadFile(_event: any, filePath: string) {
	console.log('loadFile');
	console.log(filePath);
	var res;
	res = fs.readFileSync(filePath, { encoding: 'utf-8' }).toString();
	return res;
}

function saveFile(_event: any, filePath: string, content: string) {
	console.log('saveFile');
	console.log(filePath);
	console.log(content);
	fs.writeFileSync(filePath, content, function (err: any) {
		if (err) return console.log(err);
	});
}




const { session } = require('electron');
