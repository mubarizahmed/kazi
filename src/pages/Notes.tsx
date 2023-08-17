import React, { useMemo, useState, useEffect, useRef } from 'react';
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
import { ContextMenu } from 'primereact/contextmenu';
import { MenuItem } from 'primereact/menuitem';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import 'primeicons/primeicons.css';
//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';

//core
import 'primereact/resources/primereact.min.css';

import '../tree.css';
import { DomHandler } from 'primereact/utils';

const Notes = () => {
	const [fileTree, setFileTree] = useState<TreeNode>();

	const [editorFilePath, setEditorFilePath] = useState('');

	const [fileCreate, setFileCreate] = useState<TreeNode>();
	const [newFileName, setNewFileName] = useState('');
	const [createFileError, setCreateFileError] = useState('');

	const tm = useRef(null);
	const [treeMenuSelectedKey, setTreeMenuSelectedKey] = useState<TreeNode>();

	const treeMenuItems: MenuItem[] = [
		{
			label: 'Delete',
			icon: 'pi pi-fw pi-trash',
			command: (e) => {
				console.log(treeMenuSelectedKey);
				confirmDialog({
					message: 'Do you want to delete this file/folder?',
					header: 'Delete Confirmation',
					icon: 'pi pi-info-circle',
					acceptClassName: 'p-button-danger',
					accept: () => {
						window.electronAPI.deleteFile(treeMenuSelectedKey.key).then(() => {
							// delete from the tree
							let paths = treeMenuSelectedKey.key.slice(fileTree.key.length+1, -1).split('/');

							let searchPath = fileTree.key;
							let searchObject = fileTree;

							for (let i = 0; i < paths.length - 1; i++) {
								searchPath = searchPath + '/' + paths[i];
								console.log(searchPath);
								for (let node of searchObject.children) {
									console.log(node.key);
									if (node.key === searchPath) {
										searchObject = node;
										break;
									}
								};
							}
							console.log(searchObject);
							searchObject.children = searchObject.children.filter((node: TreeNode) => node.key !== treeMenuSelectedKey.key);

							setFileTree({ ...fileTree });
						});
					},
					reject: () => {
						setTreeMenuSelectedKey(undefined);
					}
				});
			}
		}
	];

	const addFile = () => {
		console.log(fileCreate);
		let filePath = fileCreate.key + '/' + newFileName + '.md';

		fileCreate.children?.push({
			key: filePath,
			path: filePath,
			label: newFileName + '.md',
			type: 'file',
			icon: 'pi pi-fw pi-file',
			selectable: true
		} as TreeNode);
		fileCreate.children.sort((a: TreeNode, b: TreeNode) => a.label.localeCompare(b.label));

		window.electronAPI.createFile(filePath).then(() => {
			setEditorFilePath(filePath);
		});
		setFileTree({ ...fileTree });
		setFileCreate(undefined);
		setNewFileName(''); //
	};

	const createFileNameValidate = () => {
		const validWindows = /^[^\\/:*?\x22<>|]{1,255}$/;
		console.log(newFileName);
		console.log(newFileName.match(validWindows));
		if (!newFileName.match(validWindows)) {
			setCreateFileError('Invalid file name');
			return;
		}

		fileCreate.children?.forEach((node: TreeNode) => {
			if (node.label === newFileName + '.md') {
				setCreateFileError('File already exists');
				return;
			}
		});

		try {
			addFile();
		} catch (e) {
			console.log(e);
			setCreateFileError('Error creating file');
		}
	};

	const createFileFooter = (
		<div>
			{/* <Button
				label="Cancel"
				icon="pi pi-times"
				onClick={() => {
					setFileCreate(undefined);
					setNewFileName('');
					setCreateFileError('');
				}}
				className="p-button-text"
			/> */}
			<Button label="Create" icon="pi pi-check" onClick={() => createFileNameValidate()} />
		</div>
	);

	const selectFile = (path: string) => {
		console.log(path);
		setEditorFilePath(path);
	};

	const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
		if (node.type === 'directory') {
			return (
				<>
					<ContextMenu model={treeMenuItems} ref={tm} breakpoint="767px" />
					<div
						className="group flex w-full min-w-0 flex-row items-center justify-between  gap-1"
						onContextMenu={(e) => {
							setTreeMenuSelectedKey(node);
							tm.current.show(e);
						}}
					>
						<div className={options.className + ' cursor-default'}>{node.label}</div>
						<div
							className="pi pi-plus h-fit cursor-pointer opacity-0 hover:text-kaccent1 group-hover:opacity-100 "
							onClick={() => {
								console.log(node.key);
								setFileCreate(node);
							}}
						></div>
					</div>
				</>
			);
		}

		return (
			<div
				className="flex w-full min-w-0 flex-row items-center justify-start gap-1"
				onContextMenu={(e) => {
					setTreeMenuSelectedKey(node);
					tm.current.show(e);
				}}
			>
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
				<ContextMenu model={treeMenuItems} ref={tm} breakpoint="767px" />
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
							// contextMenuSelectionKey={treeMenuSelectedKey}
							// onContextMenuSelectionChange={(e) => setTreeMenuSelectedKey(e.value)}
							// onContextMenu={(e) => tm.current.show(e.originalEvent)}
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
				visible={fileCreate}
				style={{ width: '35vw' }}
				header="Create new file"
				onHide={() => {
					setFileCreate(undefined);
					setNewFileName(''); //
					setCreateFileError('');
				}}
				onShow={() => {
					// document.getElementById("newFileName")?.focus();
				}}
				footer={createFileFooter}
			>
				<span className="p-float-label mt-6 pl-2 pr-2">
					<InputText
						autoFocus
						id="newFileName"
						value={newFileName}
						onKeyUp={(e) => {
							if (e.key === 'Enter') {
								createFileNameValidate();
							}
						}}
						onChange={(e) => setNewFileName(e.target.value)}
						className={createFileError ? 'p-invalid w-full pr-8' : ' w-full pr-8'}
					/>
					<label htmlFor="newFileName">File name</label>
				</span>
				<div className={createFileError ? 'p-error-show' : 'p-error-hidden'}>
					{createFileError + ' '}
				</div>
			</Dialog>
			<ConfirmDialog />
		</div>
	);
};

export default Notes;
