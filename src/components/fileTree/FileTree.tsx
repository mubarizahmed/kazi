import React from 'react';
import { FolderCollapsible, FileTreeItem } from '../';
import type { FileTreeType } from '../../types';

const FileTree = (props: { editorFilePath: string; selectedCallback: Function; tree: FileTreeType; }) => {
	function renderTree(tree: FileTreeType) {
		// console.log(tree);
		var res: JSX.Element[] = [];
		if (tree.children) {
			tree.children.forEach((item) => {
				// console.log(item);
				if (item?.type == 'file') {
					// console.log('file');
					res.push(
						<FileTreeItem item={item} editorFilePath={props.editorFilePath} selectedCallback={props.selectedCallback} />
					);
				} else {
					// console.log('folder');
					res.push(<FolderCollapsible item={item} editorFilePath={props.editorFilePath}>{renderTree(item)}</FolderCollapsible>);
				}
			});
		} else {
			return <div>test</div>;
		}
		return res;
	}

	return (
		<div className="flex w-full flex-col items-start justify-start gap-1 text-klight ">
			{renderTree(props.tree)}
		</div>
	);
};

export default FileTree;
