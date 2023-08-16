import React, { useMemo, useState, useEffect } from 'react';
import { MilkdownProvider } from '@milkdown/react';
import { Editor, FileTree } from '../components';
import { FileTreeType } from '../types';
// const { ipcRenderer } = require('electron');
// const electronAPI = require('window.electronAPI');
import { Tree, TreeNodeTemplateOptions, TreeTogglerTemplateOptions } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import 'primeicons/primeicons.css';
//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';

//core
import 'primereact/resources/primereact.min.css';

import '../tree.css';

const Notes = () => {
	const [fileTree, setFileTree] = useState<TreeNode>();

	const [editorFilePath, setEditorFilePath] = useState('');

	const [fileCreate, setFileCreate] = useState<TreeNode>();
	const [newFileName, setNewFileName] = useState('');

	const addFile = (node: TreeNode, name: string) => {
		console.log(node);
		let filePath = node.key + '/' + name + '.md';

		node.children?.push({
			key: filePath,
			path: filePath,
			label: name + '.md',
			type: 'file',
			icon: 'pi pi-fw pi-file',
			selectable: true
		} as TreeNode);
		setFileTree({ ...fileTree });
		setFileCreate(undefined);
		setNewFileName(''); //
		window.electronAPI.createFile(filePath).then(() => {
			setEditorFilePath(filePath);
		});

	};

	const selectFile = (path: string) => {
		console.log(path);
		setEditorFilePath(path);
	};

	const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
		if (node.type === 'directory') {
			return (
				<div className="group flex w-full min-w-0 flex-row items-center justify-between  gap-1">
					<div className={options.className + ' cursor-default'}>{node.label}</div>
					<div
						className="pi pi-plus h-fit cursor-pointer opacity-0 hover:text-kaccent1 group-hover:opacity-100 "
						onClick={() => {
							console.log(node.key);
							setFileCreate(node);
						}}
					></div>
				</div>
			);
		}

		return (
			<div className="flex w-full min-w-0 flex-row items-center justify-start gap-1">
				<span className={options.className}>{node.label}</span>
			</div>
		);
	};

	const load = async () => {
		console.log('loaded');
		setFileTree(await window.electronAPI.loadFileTree());
	};

	useEffect(() => {
		load();
	}, []);

	return (
		<div className="grid h-screen w-full grid-cols-7 items-center justify-start !gap-0 ">
			<div className="col-span-2 flex h-screen flex-col items-center justify-start gap-2 border-r-2 border-kmedium  bg-kdark p-0 pt-4">
				<div className="flex w-full items-center justify-between pl-4 pr-6">
					<span className=" text-2xl tracking-wider text-klight">NOTES</span>
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
				<div className="h-full w-full overflow-hidden">
					{fileTree?.children ? (
						<Tree
							value={fileTree.children}
							className="flex h-full w-full flex-col overflow-auto"
							selectionMode="single"
							selectionKeys={editorFilePath}
							onSelectionChange={(e) => selectFile(e.value)}
							filter
							filterMode="strict"
							nodeTemplate={nodeTemplate}
						/>
					) : (
						''
					)}
				</div>
				{/* refresh button */}
			</div>
			<div className="col-span-5 flex h-screen flex-col items-center justify-start border-kmedium bg-kdark">
				{editorFilePath ? (
					<Editor path={editorFilePath} template="" />
				) : (
					<div className="flex h-full w-full flex-col items-center justify-center">
						<h1 className="text-3xl text-color-base">Select a file to edit</h1>
					</div>
				)}
			</div>
			<Dialog
				header="Create file"
				visible={fileCreate}
				style={{ width: '50vw' }}
				onHide={() => {
					setFileCreate(undefined);
				}}
			>
				<span className="p-float-label">
					<InputText
						id="newFileName"
						value={newFileName}
						onKeyUp={(e) => {
							if (e.key === 'Enter') {
								addFile(fileCreate, newFileName);

							}}}
						onChange={(e) => setNewFileName(e.target.value)}
					/>
					<label htmlFor="newFileName">New File name</label>
				</span>
			</Dialog>
		</div>
	);
};

export default Notes;
