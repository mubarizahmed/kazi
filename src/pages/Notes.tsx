import React, { useMemo, useState, useEffect } from 'react';
import { MilkdownProvider } from '@milkdown/react';
import { Editor, FileTree } from '../components';
import { FileTreeType } from '../types';
// const { ipcRenderer } = require('electron');
// const electronAPI = require('window.electronAPI');

const Notes = () => {
	const [fileTree, setFileTree] = useState<FileTreeType>();
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
		<div className="grid h-screen w-full grid-cols-7 !gap-0 items-center justify-start ">
			<div className="col-span-2 flex h-screen flex-col items-center justify-start gap-8 border-r-2 border-kmedium  bg-kdark p-0 pt-4">
				<div className="flex w-full items-center justify-between pl-6 pr-6">
					<h1 className=" text-2xl tracking-wider text-color-base">NOTES</h1>
					<button
						className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 hover:bg-kaccent1"
						onClick={() => {
							load();
						}}
					>
						<span className="material-symbols-outlined text-base text-klight hover:text-white">
							refresh
						</span>
					</button>
				</div>
				<div className="w-full overflow-y-scroll pl-4 pr-3">
					{fileTree ? (
						<FileTree
							tree={fileTree}
							selectedCallback={selectFile}
							editorFilePath={editorFilePath}
						/>
					) : (
						''
					)}
				</div>
				{/* refresh button */}
			</div>
			<div className="col-span-5 flex h-screen flex-col items-center justify-start border-r-2 border-kmedium bg-kdark">
				{editorFilePath ? (
					<Editor path={editorFilePath} template="" />
				) : (
					<div className="flex h-full w-full flex-col items-center justify-center">
						<h1 className="text-3xl text-color-base">Select a file to edit</h1>
					</div>
				)}
			</div>
		</div>
	);
};

export default Notes;
