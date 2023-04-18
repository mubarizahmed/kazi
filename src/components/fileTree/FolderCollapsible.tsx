import { FileTreeType } from '@/types';
import React, { useState, useEffect } from 'react';

const FolderCollapsible = (props: {children: JSX.Element | JSX.Element[], item: FileTreeType, editorFilePath:string}) => {
	const [collapsed, setCollapsed] = useState(true);
	const [selected, setSelected] = useState(props.editorFilePath.includes(props.item.path));

	useEffect(() => {
    console.log(props.editorFilePath);
		setSelected(props.editorFilePath.includes(props.item.path));
	}, [props.editorFilePath]);

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	console.log(props.children);
	return (
		<>
			<div
				className="flex w-full cursor-pointer  items-center justify-between"
				onClick={toggleCollapsed}
			>
				<div className={selected ? 'flex items-center gap-2 text-kaccent1' : 'flex items-center gap-2'}>
					<span className="material-symbols-outlined text-base">{collapsed ? 'folder' : 'folder_open'}</span>
					{props.item.name}
				</div>

				<span className="material-symbols-outlined">
					{collapsed ? 'expand_more' : 'expand_less'}
				</span>
			</div>
			{props.children ? (
				<div
					className={
						collapsed
							? 'hidden w-full'
							: 'flex w-full flex-col items-start justify-start gap-1 pl-6 text-klight'
					}
				>
					{props.children}
				</div>
			) : null}
		</>
	);
};

export default FolderCollapsible;
