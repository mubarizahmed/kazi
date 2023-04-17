import React, { useState } from 'react';

const FolderCollapsible = (props: {children: JSX.Element | JSX.Element[], name: string}) => {
	const [collapsed, setCollapsed] = useState(true);

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
				<div className="flex items-center gap-2">
					<span className="material-symbols-outlined text-base">folder</span>
					{props.name}
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
