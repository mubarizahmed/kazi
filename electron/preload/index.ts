const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	loadFileTree: () => ipcRenderer.invoke('load-fileTree'),
	updateFileTree: () => ipcRenderer.invoke('update-fileTree'),
	loadFile: (filePath: string) => ipcRenderer.invoke('load-file', filePath),
	saveFile: (filePath: string, content: string) =>
		ipcRenderer.invoke('save-file', filePath, content),
	createFile: (filePath: string) => ipcRenderer.invoke('create-file', filePath),
	deleteFile: (filePath: string) => ipcRenderer.invoke('delete-file', filePath),
	loadSettings: () => ipcRenderer.invoke('load-settings'),
	saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
	changeUserDirectory: () => ipcRenderer.invoke('change-user-directory'),
	updateTaskTree: () => ipcRenderer.invoke('update-task-tree'),
	loadTaskTree: () => ipcRenderer.invoke('load-task-tree'),
	startTaskScan: () => ipcRenderer.invoke('start-task-scan'),
	printFile: (filePath: string, content: string) =>
		ipcRenderer.invoke('print-file', filePath, content),
	getThemes: () => ipcRenderer.invoke('get-themes'),
	changeTheme: (themeName: string) => ipcRenderer.invoke('change-theme', themeName),
	applyTheme: (callback: Function) =>
		ipcRenderer.on('apply-theme', (event, theme) => {
			callback(theme);
		})
});

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
	return new Promise((resolve) => {
		if (condition.includes(document.readyState)) {
			resolve(true);
		} else {
			document.addEventListener('readystatechange', () => {
				if (condition.includes(document.readyState)) {
					resolve(true);
				}
			});
		}
	});
}

const safeDOM = {
	append(parent: HTMLElement, child: HTMLElement) {
		if (!Array.from(parent.children).find((e) => e === child)) {
			return parent.appendChild(child);
		}
	},
	remove(parent: HTMLElement, child: HTMLElement) {
		if (Array.from(parent.children).find((e) => e === child)) {
			return parent.removeChild(child);
		}
	}
};
let arg = process.argv.filter((p) => p.indexOf('--themeColor1=') >= 0)[0];
console.log(arg);

const themeColor1 = arg.substring(arg.indexOf('=') + 1);
console.log(themeColor1);

arg = process.argv.filter((p) => p.indexOf('--themeColor2=') >= 0)[0];
const themeColor2 = arg.substring(arg.indexOf('=') + 1);
/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
	const className = `loaders-css__square-spin`;
	const styleContent = `
    @keyframes square-spin {
      25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
      50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
      75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
      100% { transform: perspective(100px) rotateX(0) rotateY(0); }
    }
    .${className} > div {
      animation-fill-mode: both;
      width: 50px;
      height: 50px;
      background: rgb(${themeColor2});
      animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
    }
    .app-loading-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgb(${themeColor1});
      z-index: 9;
    }
    `;
	const oStyle = document.createElement('style');
	const oDiv = document.createElement('div');

	oStyle.id = 'app-loading-style';
	oStyle.innerHTML = styleContent;
	oDiv.className = 'app-loading-wrap';
	oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

	return {
		appendLoading() {
			safeDOM.append(document.head, oStyle);
			safeDOM.append(document.body, oDiv);
		},
		removeLoading() {
			safeDOM.remove(document.head, oStyle);
			safeDOM.remove(document.body, oDiv);
		}
	};
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
	ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
