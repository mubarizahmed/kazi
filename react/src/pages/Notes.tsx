import React, { useMemo, useState, useEffect } from 'react';
import { MilkdownProvider } from '@milkdown/react';
import { Editor, FileTree } from '../components';
// const { ipcRenderer } = require('electron');

const Notes = () => {
	const [fileTree, setFileTree] = useState([]);
	const [editorFilePath, setEditorFilePath] = useState('');

	const selectFile = (path: string) => {
		console.log(path);
		setEditorFilePath(path);
	};

	const load = async () => {
		console.log('loaded');
		setFileTree(await window.electronAPI.loadFileTree());
	};


	useEffect(() => {
		load();
	}, []);

	return (
		<div className="grid h-screen w-full grid-cols-7 flex-row items-center justify-start ">
			<div className="col-span-2 flex h-screen flex-col items-center justify-start gap-8 border-r-2 border-kmedium bg-kdark pr-6 pl-6 pt-4 ">
				<div className="w-full flex items-center justify-between">
				<h1 className=" text-2xl tracking-wider text-color-base">NOTES</h1>
				<button
					className="h-6 w-6 bg-transparent rounded-full p-0 hover:bg-kaccent1 flex items-center justify-center"
					onClick={() => {
						load();
					}}
				>
					<span className="material-symbols-outlined text-klight text-base hover:text-white">refresh</span>
				</button>
				</div>
				<FileTree tree={fileTree} selectedCallback={selectFile} editorFilePath={editorFilePath} />
				{/* refresh button */}

			</div>
			<div className="col-span-5 flex h-screen flex-col items-center justify-start border-r-2 border-kmedium bg-kdark">
				{(editorFilePath) ?
					<Editor path={editorFilePath} template='' />
				:
					<div className="flex flex-col items-center justify-center h-full w-full">
						<h1 className="text-3xl text-color-base">Select a file to edit</h1>
					</div>

				}
				
			</div>
		</div>
	);
};

export default Notes;
