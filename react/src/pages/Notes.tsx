import React, { useMemo, useState, useEffect } from 'react';
import { MilkdownProvider } from '@milkdown/react';
import { Editor } from '../components';
// const { ipcRenderer } = require('electron');

const Notes = () => {
	const [fileTree, setFileTree] = useState([]);

	const load = async () => {
		console.log('loaded');
		setFileTree(await window.electronAPI.loadFileTree());
	};

	useEffect(() => {
		load();
		console.log(fileTree);
	}, []);

	function renderTree(tree: Object[]) {
		console.log(tree);
		var res = [];
		if (tree.children) {
			tree.children.forEach((item) => {
				console.log(item);
				if (item?.type == 'file') {
					console.log('file');
					res.push(<div>{item.name}</div>);
				} else {
					console.log('folder');
					res.push(<div>Folder: {item.name}</div>
						// </div>
					);
				}
			});
		} else {
			return <div>test</div>;
		}
		return res;
	}

	return (
		<div className="grid h-screen w-full grid-cols-7 flex-row items-center justify-start ">
			<div className="col-span-2 flex h-screen flex-col items-center justify-start gap-8 border-r-2 border-space-cadet bg-rich-black p-8">
				<h1 className="w-full text-2xl tracking-wider text-color-base">NOTES</h1>
				{renderTree(fileTree)}
			</div>
			<div className="col-span-5 flex h-screen flex-col items-center justify-start border-r-2 border-space-cadet bg-rich-black pb-8 pt-8">
				<Editor template="testing" />
			</div>
		</div>
	);
};

export default Notes;
