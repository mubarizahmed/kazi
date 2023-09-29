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
import { Splitter, SplitterPanel } from 'primereact/splitter';

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
	const [editorFilePathHistory, setEditorFilePathHistory] = useState<string[]>([]);
	const [editorFilePathHistoryPos, setEditorFilePathHistoryPos] = useState<number>(0);

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
						window.electronAPI.deleteFile(treeMenuSelectedKey.path).then(() => {
							// delete from the tree
							let paths = treeMenuSelectedKey.path.slice(fileTree.path.length + 1).split('/');

							let searchPath = fileTree.path;
							let searchObject = fileTree;
							console.log(paths);
							for (let i = 0; i < paths.length - 1; i++) {
								searchPath = searchPath + '/' + paths[i];
								console.log(searchPath);
								for (let node of searchObject.children) {
									console.log(node.path);
									if (node.path === searchPath) {
										searchObject = node;
										break;
									}
								}
							}
							console.log(searchObject);
							searchObject.children = searchObject.children.filter(
								(node: TreeNode) => node.key !== treeMenuSelectedKey.key
							);

							setFileTree({ ...fileTree });
						});
					},
					reject: () => {
						setTreeMenuSelectedKey(undefined);
					},
					className: 'tree-delete-dialog'
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
		if (path === editorFilePath) return;
		setEditorFilePath(path);
		// add to history
		setEditorFilePathHistoryPos(editorFilePathHistory.length);
		setEditorFilePathHistory([...editorFilePathHistory, path]);
	};

	const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
		if (node.type === 'directory') {
			return (
				<>
					{/* <ContextMenu model={treeMenuItems} ref={tm} breakpoint="767px" /> */}
					<div
						className="group flex w-full min-w-0 flex-row items-center justify-between  gap-1"
						// onContextMenu={(e) => {
						// 	setTreeMenuSelectedKey(node);
						// 	tm.current.show(e);
						// }}
					>
						<div className={options.className + ' cursor-default'}>{node.label}</div>
						<div
							className="pi pi-plus h-fit cursor-pointer opacity-0 hover:text-secondary-400 group-hover:opacity-100 "
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
				// onContextMenu={(e) => {
				// 	setTreeMenuSelectedKey(node);
				// 	tm.current.show(e);
				// }}
			>
				<span className={options.className}>{node.label}</span>
			</div>
		);
	};

	const treeFooter = (
		<div className="flex h-8 w-full items-center justify-center">
			<div
				className="pi pi-plus h-fit cursor-pointer hover:text-secondary-400 "
				onClick={() => {
					console.log(fileTree.key);
					setFileCreate(fileTree);
				}}
			></div>
		</div>
	);

	const load = async () => {
		console.log('loaded');
		let tree = await window.electronAPI.loadFileTree();
		console.log(tree);
		setFileTree(tree);
	};

	const historyBack = () => {
		setEditorFilePath(editorFilePathHistory[editorFilePathHistoryPos-1]);
		setEditorFilePathHistoryPos(editorFilePathHistoryPos-1);
	}

	const historyForward = () => {
		setEditorFilePath(editorFilePathHistory[editorFilePathHistoryPos+1]);
		setEditorFilePathHistoryPos(editorFilePathHistoryPos+1);
	}

	// session storage functions
	useEffect(() => {
		let fp = sessionStorage.getItem('kazi-editor-file-path');
		if (fp !== null && fp !== '') setEditorFilePath(fp);

		let ft = sessionStorage.getItem('kazi-file-tree');
		if (ft !== null && ft !== 'undefined') {
			setFileTree(JSON.parse(ft));
		}

		let fh = sessionStorage.getItem('kazi-editor-file-path-history');
		if (fh !== null && fh !== 'undefined') {
			console.log('get session storage path history', fh);
			setEditorFilePathHistory(JSON.parse(fh));
		}

		let fhp = sessionStorage.getItem('kazi-editor-file-path-history-pos');
		if (fhp !== null && fhp !== '') {
			console.log('get session storage path history', fh);
			setEditorFilePathHistoryPos(parseInt(fhp));
		}

		console.log('loaded');

		load();
	}, []);

	useEffect(() => {
		if (fileTree !== null && fileTree !== 'undefined')
			sessionStorage.setItem('kazi-file-tree', JSON.stringify(fileTree));
	}, [fileTree]);

	useEffect(() => {
		if (editorFilePath !== null && editorFilePath !== 'undefined'){
			sessionStorage.setItem('kazi-editor-file-path', editorFilePath);
		}
	}, [editorFilePath]);

	useEffect(() => {
		if (editorFilePathHistory.length > 0){
			console.log('set session editor file path history',editorFilePathHistory)
			sessionStorage.setItem('kazi-editor-file-path-history', JSON.stringify(editorFilePathHistory));
		}
	}, [editorFilePathHistory]);

	useEffect(() => {
		if (editorFilePathHistoryPos !== 0){
			console.log('pos',editorFilePathHistoryPos,editorFilePathHistoryPos > 0);
			sessionStorage.setItem('kazi-editor-file-path-history-pos', editorFilePathHistoryPos.toString());
		}
	}, [editorFilePathHistoryPos]);

	return (
		<div className="h-screen w-[calc(100vw-4rem)] overflow-hidden bg-primary-900">
			<Splitter
				style={{ width: '100%', height: '100%' }}
				className="bg-primary-900"
				stateStorage="session"
				stateKey="kazi-notes-splitter"
			>
				{/* <div className="col-span-2 flex h-screen flex-col items-center justify-start gap-2 border-r-2 border-primary-800  bg-primary-900 p-0 pt-4"> */}
				<SplitterPanel
					size={200 / 7}
					minSize={15}
					className="flex h-full flex-col items-center justify-start gap-2  overflow-clip  border-primary-800 bg-primary-900 p-0 pt-5"
				>
					<div className="flex w-full items-center justify-between pl-4 pr-6">
						<span className=" text-3xl font-light uppercase tracking-widest text-primary-200">
						Notes
					</span>
						<div className="flex h-full items-center gap-2">
							<button
								className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 hover:bg-secondary-400"
								onClick={() => {
									console.log(fileTree.key);
									setFileCreate(fileTree);
								}}
							>
								<span className="pi pi-plus text-base text-primary-200 hover:text-primary-900">
									
								</span>
							</button>
							<button
								className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 hover:bg-secondary-400"
								onClick={async () => {
									let tree = await window.electronAPI.updateFileTree();
									console.log(tree);
									setFileTree(tree);
								}}
							>
								<span className="pi pi-refresh text-base text-primary-200 hover:text-primary-900">

								</span>
							</button>
						</div>
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
								onContextMenu={(e) => {
									setTreeMenuSelectedKey(e.node);
									tm.current.show(e.originalEvent);
								}}
							/>
						) : (
							''
						)}
					</div>
					{/* refresh button */}
				</SplitterPanel>
				{/* </div> */}
				{/* <div className="col-span-5 flex h-screen flex-col items-center justify-start border-primary-800 bg-primary-900"> */}
				<SplitterPanel
					size={500 / 7}
					minSize={15}
					className="flex h-full w-full min-w-0 flex-col pt-4 items-center justify-start overflow-clip border-primary-800 bg-primary-900"
				>
					{editorFilePath ? (
						<Editor
							path={editorFilePath}
							relativePath={editorFilePath.slice(fileTree.key.length)}
							template=""
							forward={(editorFilePathHistoryPos < editorFilePathHistory.length - 1) ? historyForward: undefined}
							backward={(editorFilePathHistoryPos > 0) ? historyBack: undefined}
						/>
					) : (
						<div className="flex h-full w-full flex-col items-center justify-center">
							<h1 className="text-3xl text-primary-200">Select a file to edit</h1>
						</div>
					)}
				</SplitterPanel>
			</Splitter>
			{/* </div> */}
			<Dialog
				visible={fileCreate}
				style={{ width: '35vw' }}
				header="Create new file"
				contentClassName="tree-add-dialog"
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
