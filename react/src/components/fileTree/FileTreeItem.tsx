import React, { useState, useEffect } from 'react';
import { FileTreeType } from '../../types';

const FileTreeItem = (props: {item: FileTreeType, editorFilePath: string, selectedCallback: Function }) => {
	const [selected, setSelected] = useState(props.editorFilePath == props.item.path);

	const toggleSelected = () => {
		if (!selected) {
			setSelected(true);
			props.selectedCallback(props.item.path);
		}
	};

	useEffect(() => {
    console.log(props.editorFilePath);
		setSelected(props.editorFilePath == props.item.path);
	}, [props.editorFilePath]);

	return (
		<div className={(selected ? 'text-kaccent1' : 'text-klight') + " cursor-pointer"} onClick={toggleSelected}>
			{props.item.name}
		</div>
	);
};

export default FileTreeItem;
