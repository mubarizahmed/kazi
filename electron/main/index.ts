import { app, BrowserWindow, shell, ipcMain, dialog, contextBridge } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { update } from './update';
import { FileTreeNodeType, FileTreeType, TaskTree } from '@/types';
import { scanAllFiles, startTaskScan } from './taskScanner';
import { scanUpdateFileTree, loadFile, saveFile, createFile, deleteFile } from './fileScanner';
import {
	createDb,
	getProjects,
	createProject,
	getProjectTree,
	getTaskTree,
	getAllTaskTrees
} from './db';
const path = require('path');
const dirTree = require('directory-tree');
const fs = require('fs');
const Store = require('electron-store');
const sqlite3 = require('sqlite3').verbose();

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
let workerWindow: BrowserWindow | null = null;

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
const printHTML = join(process.env.DIST, 'print.html');

var projectTree: FileTreeNodeType = {} as FileTreeNodeType;
var taskTree: TaskTree[] = [];

// themes
const defaultTheme = {
	name: 'Default Dark',
	color1: [10, 10, 26],
	color2: [13, 12, 30],
	color3: [32, 30, 60],
	color4: [131, 145, 178],
	color5: [217, 216, 218],
	accent1: [41, 182, 126],
	accent2: [249, 100, 83]
}
const solarizedTheme = {
	name: 'Solarized',
	color1: [0, 43, 54],
	color2: [7, 54, 66],
	color3: [88, 110, 117],
	color4: [200, 200, 200],
	color5: [100, 122, 130],
	accent1: [41, 182, 126],
	accent2: [249, 100, 83]
}

interface Themes {
	[key: string]: any;
}

// var themes:Themes = {};
// themes["defaultDark"] = defaultTheme;
// themes["solarized"] = solarizedTheme;

var themes = [];
themes.push(defaultTheme);
themes.push(solarizedTheme);


// store stuff
export const store = new Store({
	// We'll call our data file 'user-preferences'
	configName: 'user-preferences',
	defaults: {
		// 800x600 is the default size of our window
		windowBounds: { width: 800, height: 600, x: 0, y: 0 },
		windowFullScreen: false,
		userDirectory: path.join(app.getPath('documents'), 'Kazi'),
		zoomFactor: 1,
		currentTheme: defaultTheme
	}
});
module.exports = { projectTree, store };

var currentTheme = store.get('currentTheme');


function loadSettings() {
	return [store.store, themes];
}



function changeUserDirectory() {
	if (win)
		dialog
			.showOpenDialog(win, {
				properties: ['openDirectory']
			})
			.then((result) => {
				if (!result.canceled) {
					console.log(result.filePaths[0]);
					store.set('userDirectory', result.filePaths[0]);
				}
			});
	return store.store;
}

const changeTheme = (_event: any, theme: any) => {
	try {
		console.log(theme)
		win?.webContents.send('apply-theme', theme);
		store.set('currentTheme', theme);
		currentTheme = theme;
	} catch (error) {
		console.log(error);
	}
	return store.store;
}

createDb(path.join(store.get('userDirectory'), 'kazi.db'));

getProjects().then((projects: any) => {
	console.log(projects);
});

async function createWindow() {
	win = new BrowserWindow({
		title: 'Kazi',
		icon: join(process.env.PUBLIC, 'kazi_word_l.png'),
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#0d0c1e',
			symbolColor: '#74b1be'
		},
		autoHideMenuBar: true,
		width: store.get('windowBounds.width'),
		height: store.get('windowBounds.height'),
		x: store.get('windowBounds.x'),
		y: store.get('windowBounds.y'),
		fullscreen: store.get('windowFullScreen'),

		webPreferences: {
			additionalArguments: [`--themeColor1=${store.get('currentTheme').color2}`, `--themeColor2=${store.get('currentTheme').color4}`],
			preload,
			// Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
			// Consider using contextBridge.exposeInMainWorld
			// Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
			nodeIntegration: true,
			contextIsolation: true,
			zoomFactor: store.get('zoomFactor')
		}
	});



	if (url) {
		// electron-vite-vue#298
		win.loadURL(url);
		// Open devTool if the app is not packaged
		win.webContents.openDevTools();
	} else {
		win.loadFile(indexHtml);
		// win.webContents.openDevTools();
	}
	contextBridge.exposeInMainWorld('myAPI', {
		currentTheme: currentTheme,
	});

	// Test actively push message to the Electron-Renderer
	win.webContents.once('did-finish-load', () => {
		console.log('did-finish-load');
		win?.webContents.send('main-process-message', new Date().toLocaleString());
		// win?.webContents.send('apply-theme', currentTheme);
		win?.webContents.setZoomFactor(store.get('zoomFactor'));
		win?.webContents.send('apply-theme', currentTheme);
	});

	win.on('ready-to-show', () => {
		win?.webContents.setZoomFactor(store.get('zoomFactor'));
		win?.webContents.once('did-finish-load', () => {


			win?.webContents.setZoomFactor(store.get('zoomFactor'));
			win?.webContents.send('apply-theme', currentTheme);
			console.log('ready-to-show');
		});

	});

	// // Make all links open with the browser, not with the application
	// win.webContents.setWindowOpenHandler(({ url }) => {
	// 	if (url.startsWith('https:')) shell.openExternal(url);
	// 	return { action: 'deny' };
	// });

	win.webContents.setWindowOpenHandler(({ url }) => {
		// config.fileProtocol is my custom file protocol
		if (url.startsWith('file://')) {
			return { action: 'allow' };
		}
		// open url in a browser and prevent default
		shell.openExternal(url);
		return { action: 'deny' };
	});

	app.commandLine.appendSwitch('--remote-debugging-port', '9222');

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

	workerWindow = new BrowserWindow({
		webPreferences: {
			webSecurity: false,
			nodeIntegration: true,
			contextIsolation: false
		}
	});
	workerWindow.loadURL('file://' + printHTML);
	workerWindow.hide();
	workerWindow.webContents.openDevTools();
	workerWindow.on('closed', () => {
		workerWindow = null;
	});
}

app.whenReady().then(() => {
	getProjectTree().then((tree: any) => {
		projectTree = tree;
	});
	updateFileTree();

	ipcMain.handle('load-fileTree', loadFileTree);
	ipcMain.handle('update-fileTree', updateFileTree);
	ipcMain.handle('load-file', loadFile);
	ipcMain.handle('save-file', saveFile);
	ipcMain.handle('create-file', async (e, path) => {
		createFile(e, path);
		updateFileTree();
	});
	ipcMain.handle('delete-file', async (e, path) => {
		deleteFile(e, path);
		updateFileTree();
	});
	ipcMain.handle('load-settings', loadSettings);
	ipcMain.handle('change-user-directory', changeUserDirectory);
	ipcMain.handle('load-task-tree', getAllTaskTrees);
	ipcMain.handle('update-task-tree', scanAllFiles);
	ipcMain.handle('start-task-scan', startTaskScan);
	ipcMain.handle('print-file', printFile);

	ipcMain.on('readyToPrintPDF', (event) => {
		// Use default printing options
		workerWindow?.webContents.print({ printBackground: false });
	});

	ipcMain.handle('get-themes', () => { return themes; });
	ipcMain.handle('change-theme', changeTheme);

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

const loadFileTree = () => {
	console.log(projectTree);
	return projectTree;
};

const updateFileTree = async () => {
	console.log('updateFileTree');
	let tree: FileTreeNodeType = await scanUpdateFileTree(store.get('userDirectory'));
	projectTree = tree;

	return tree;
};

const printFile = (e: any, filePath: string, content: string) => {
	console.log(content);
	// /home/mebza/apps/kazi/dist/print.html
	console.log(printHTML);
	console.log('file://' + __dirname + '/print.html');
	// let window = BrowserWindow.fromWebContents(e.sender);
	// window.webContents.printToPDF({ printSelectionOnly: true, }).then((data) => {
	// 		// Use the data however you like :)
	// });

	workerWindow?.webContents.send('printPDF', content);
};

const { session } = require('electron');
