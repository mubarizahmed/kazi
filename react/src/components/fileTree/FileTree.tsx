import React from 'react';
import { FolderCollapsible, FileTreeItem } from '../';

const FileTree = (props) => {
	function renderTree(tree: Object[]) {
		// console.log(tree);
		var res = [];
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
					res.push(<FolderCollapsible name={item.name}>{renderTree(item)}</FolderCollapsible>);
				}
			});
		} else {
			return <div>test</div>;
		}
		return res;
	}

	return (
		<div className="flex w-full flex-col items-start justify-start gap-1 text-klight">
			{renderTree(props.tree)}
		</div>
	);
};

export default FileTree;
