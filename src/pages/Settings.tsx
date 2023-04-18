import React, { useState, useEffect } from 'react';

const Settings = () => {
	const [selectedTab, setSelectedTab] = useState(0);
	const [settingValues, setSettingValues] = useState( window.electronAPI.loadSettings());

	const load = async () => {
		console.log('loaded');
		setSettingValues(await window.electronAPI.loadSettings());
		console.log(settingValues);
	};

	useEffect(() => {
		load();
	}, []);



	const settings = [
		{
			name: 'General',
			icon: 'settings',
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<div className="flex w-full justify-between pl-6 pr-6">
						<div className="flex-col">
							<div className="text-xl">Kazi Workspace Directory</div>
							<div className="text-sm text-klight">
								The directory where all your projects will be stored
							</div>
							<span className="text-sm text-klight">Current: {settingValues.userDirectory}</span>
						</div>
						<button 
							className="bg-kaccent1 text-kdark rounded-md h-8 px-2 py-1"
							onClick={async () => {setSettingValues(await window.electronAPI.changeUserDirectory())}}
						>Change</button>
					</div>
					<hr />
				</div>
			)
		},
		{
			name: 'Appearance',
			icon: 'palette',
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<div className="flex w-full pl-6 pr-6">
						<div className="flex-col">
							<span className="text-xl">Kazi Workspace Directory</span>
							<span className="text-sm text-klight">
								The directory where all your projects will be stored
							</span>
							<span className="text-sm text-klight">Current: </span>
						</div>

					</div>
					<hr />
				</div>
			)
		},
		{
			name: 'Editor',
			icon: 'code',
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<div className="flex w-full pl-6 pr-6">
						<div className="flex-col">
							<span className="text-xl">Kazi Workspace Directory</span>
							<span className="text-sm text-klight">
								The directory where all your projects will be stored
							</span>
							<span className="text-sm text-klight">Current: </span>
						</div>
					</div>
					<hr />
				</div>
			)
		},
		{
			name: 'Keybindings',
			icon: 'keyboard',
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<div className="flex w-full pl-6 pr-6">
						<div className="flex-col">
							<span className="text-xl">Kazi Workspace Directory</span>
							<span className="text-sm text-klight">
								The directory where all your projects will be stored
							</span>
							<span className="text-sm text-klight">Current: </span>
						</div>
					</div>
					<hr />
				</div>
			)
		},
		{
			name: 'Extensions',
			icon: 'extension',
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<div className="flex w-full pl-6 pr-6">
						<div className="flex-col">
							<span className="text-xl">Kazi Workspace Directory</span>
							<span className="text-sm text-klight">
								The directory where all your projects will be stored
							</span>
							<span className="text-sm text-klight">Current: </span>
						</div>
					</div>
					<hr />
				</div>
			)
		},
		{
			name: 'Sync',
			icon: 'sync',
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<div className="flex w-full pl-6 pr-6">
						<div className="flex-col">
							<span className="text-xl">Kazi Workspace Directory</span>
							<span className="text-sm ">
								The directory where all your projects will be stored
							</span>
							<span className="text-sm ">Current: </span>
						</div>
					</div>
					<hr />
				</div>
			)
		}
	];

	const renderSettingsMenu = () => {
		var res: JSX.Element[] = [];
		for (let i = 0; i < settings.length; i++) {
			res.push(
				<button
					className={`flex  w-full items-center justify-start gap-4 rounded bg-transparent p-4 py-2 hover:border-transparent hover:bg-kmedium focus:outline-0 ${
						selectedTab === i ? 'bg-kaccent1' : ''
					}`}
					onClick={() => {
						setSelectedTab(i);
					}}
				>
					<span className="material-symbols-outlined text-base text-klight hover:text-white">
						{settings[i].icon}
					</span>
					<span className="text text-klight hover:text-white">{settings[i].name}</span>
				</button>
			);
		}
		return res;
	};

	return (
		<div className="grid h-screen w-full grid-cols-7 items-center justify-start">
			<div className="col-span-2 flex h-screen flex-col items-center justify-start gap-8 border-r-2 border-kmedium  bg-kdark p-0 pt-4">
				<div className="flex w-full items-center justify-between pl-4 pr-6">
					<span className=" text-2xl tracking-wider text-klight">SETTINGS</span>
				</div>
				<div className="flex w-full flex-col items-start justify-start gap-2 px-4 text-klight ">
					{settings.map((setting, i) => (
						<button
							className={`flex  w-full items-center justify-start gap-4 rounded bg-transparent p-4 py-2 hover:border-transparent hover:bg-kmedium focus:outline-0 ${
								selectedTab == i ? '!bg-kmedium' : ''
							}`}
							onClick={() => {
								setSelectedTab(i);
							}}
						>
							<span className="material-symbols-outlined text-base text-klight ">
								{setting.icon}
							</span>
							<span className="text text-klight ">{setting.name}</span>
						</button>
					))}
				</div>
			</div>
			<div className="col-span-5 flex h-screen text-klight flex-col items-center justify-start border-r-2
		 py-4 border-kmedium bg-kdark">
				{settings[selectedTab].content}
			</div>
		</div>
	);
};

export default Settings;
