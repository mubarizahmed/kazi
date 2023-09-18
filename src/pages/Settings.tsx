import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';

const Settings = () => {
	const [selectedTab, setSelectedTab] = useState(0);
	const [settingValues, setSettingValues] = useState({});
	const [themes, setThemes] = useState([]);

	const load = async () => {
		console.log('loaded');
		await window.electronAPI.loadSettings().then((res) => {
			setSettingValues(res[0]);
			setThemes(res[1]);
			console.log(res);
		});
	};

	useEffect(() => {
		load();
	}, []);

	const themeOptionsTemplate = (theme) => {
		const createColorCircle = (color) => {
			const rgbValue = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
			return <div className="h-4 w-4 rounded-full theme-circle" style={{ backgroundColor: rgbValue }}></div>;
		};
		if (!theme?.name) return (<div></div>);
		return (
			<div className="theme-item overflow-none flex flex-row items-center">
				<div className="text mr-4 w-24">{theme.name}</div>
				<div className=" theme-circle-container flex h-4 flex-grow flex-row gap-1">
					{createColorCircle(theme.color1)}
					{createColorCircle(theme.color2)}
					{createColorCircle(theme.color3)}
					{createColorCircle(theme.color4)}
					{createColorCircle(theme.color5)}
					{createColorCircle(theme.accent1)}
					{createColorCircle(theme.accent2)}
				</div>
			</div>
		);
	};

	const settings = [
		{
			name: 'General',
			icon: 'settings',
			content: (
				<div className="flex w-full flex-col items-start justify-start divide-x-0 pl-6 pr-6">
					<div className="flex w-full justify-between ">
						<div className="flex-col">
							<div className="text-xl">Kazi Workspace Directory</div>
							<div className="text-sm text-klight">
								The directory where all your projects will be stored
							</div>
							<span className="text-sm text-klight">Current: {settingValues.userDirectory}</span>
						</div>
						<button
							className="h-8 rounded-md bg-kaccent1 px-2 py-1 text-kdark"
							onClick={async () => {
								setSettingValues(await window.electronAPI.changeUserDirectory());
							}}
						>
							Change
						</button>
					</div>
					<hr />
					<div className="flex w-full justify-between ">
						<div className="flex-col">
							<div className="text-xl">Kazi Workspace Directory</div>
							<div className="text-sm text-klight">
								The directory where all your projects will be stored
							</div>
							<span className="text-sm text-klight">Current: {settingValues.userDirectory}</span>
						</div>
						<button
							className="h-8 rounded-md bg-kaccent1 px-2 py-1 text-kdark"
							onClick={async () => {
								setSettingValues(await window.electronAPI.changeUserDirectory());
							}}
						>
							Change
						</button>
					</div>
					<hr />
				</div>
			)
		},
		{
			name: 'Appearance',
			icon: 'palette',
			content: (
				<div className="flex w-full flex-col items-start justify-start divide-x-2 pl-6 pr-6">
					<div className="flex w-full justify-between pb-2">
						<div className="flex flex-col">
							<span className="text-xl">Theme</span>
						</div>
						{settingValues?.currentTheme ?
						<Dropdown
							className=" ml-4 h-fit"
							value={settingValues?.currentTheme}
							optionLabel="name"
							valueTemplate={themeOptionsTemplate}
							itemTemplate={themeOptionsTemplate}
							options={themes}
							onChange={(e) => {
								// setSettingValues({ ...settingValues, theme: e.value });
								window.electronAPI.changeTheme(e.value).then((res) => {
									setSettingValues(res);
								});
							}}
						/> : <div></div>
					}
					</div>
					<div className="text-sm text-klight !border-0">
						Additional themes can be installed by placing them in the /.Themes folder.
					</div>
					{/* <span className="text-sm text-klight">Current: {settingValues?.currentTheme?.name} </span> */}
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
							<span className="text-sm ">The directory where all your projects will be stored</span>
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
			<div
				className="col-span-5 flex h-screen flex-col items-center justify-start border-r-2 border-kmedium
		 bg-kdark py-4 pt-20 text-klight"
			>
				{settings[selectedTab].content}
			</div>
		</div>
	);
};

export default Settings;
