import React, { useMemo, useState, useEffect } from 'react';
import { MilkdownProvider } from '@milkdown/react';
import { Editor, FileTree } from '../components';
// const { ipcRenderer } = require('electron');

const Notes = () => {
	const [fileTree, setFileTree] = useState([]);
	const [editorFile, setEditorFile] = useState('');
	const [editorFilePath, setEditorFilePath] = useState('');

	const selectFile = (path: string) => {
		console.log(path);
		setEditorFilePath(path);
	};

	const load = async () => {
		console.log('loaded');
		setFileTree(await window.electronAPI.loadFileTree());
	};

	const loadFile = async () => {
		// const file = await window.electronAPI.loadFile(editorFilePath);
		// console.log('loaded file', file);
		setEditorFile(await window.electronAPI.loadFile(editorFilePath));
	};

	useEffect(() => {
		if (editorFilePath) {
			loadFile();
		}
	}, [editorFilePath]);

	useEffect(() => {
		console.log('Loaded file from' + editorFilePath);
		console.log(editorFile);
	}, [editorFile]);

	useEffect(() => {
		load();
	}, []);

	return (
		<div className="grid h-screen w-full grid-cols-7 flex-row items-center justify-start ">
			<div className="col-span-2 flex h-screen flex-col items-center justify-start gap-8 border-r-2 border-kmedium bg-kdark p-8">
				<h1 className="w-full text-2xl tracking-wider text-color-base">NOTES</h1>
				<FileTree tree={fileTree} selectedCallback={selectFile} editorFilePath={editorFilePath} />
				{/* refresh button */}
				<button
					className="h-8 w-8 rounded-full bg-color-base"
					onClick={() => {
						load();
					}}
				>
					<span className="material-symbols-outlined">refresh</span>
				</button>
			</div>
			<div className="col-span-5 flex h-screen flex-col items-center justify-start border-r-2 border-kmedium bg-kdark pb-8">
				<Editor template={editorFile} path={editorFilePath.slice(17)} />
			</div>
		</div>
	);
};

export default Notes;
