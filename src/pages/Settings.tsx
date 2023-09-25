import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { LuConstruction } from 'react-icons/lu';
import { Theme } from '@/types';
import { IconContext } from 'react-icons';

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

	const themeOptionsTemplate = (theme: Theme) => {
		const createColorCircle = (color: number[]) => {
			const rgbValue = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
			return (
				<div
					className="theme-circle h-4 w-4 rounded-full"
					style={{ backgroundColor: rgbValue }}
				></div>
			);
		};
		if (!theme?.name) return <div></div>;
		return (
			<div className="theme-item overflow-none flex flex-row items-center">
				<div className="text mr-4 w-24">{theme.name}</div>
				<div className=" theme-circle-container flex h-4 flex-grow flex-row gap-1">
					{createColorCircle(theme.primary[900])}
					{createColorCircle(theme.primary[800])}
					{createColorCircle(theme.primary[600])}
					{createColorCircle(theme.secondary[400])}
					{createColorCircle(theme.danger)}
					{createColorCircle(theme.caution)}
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
							<div className="text-sm text-primary-200">
								The directory where all your projects will be stored
							</div>
							<span className="text-sm text-primary-200">
								Current: {settingValues.userDirectory}
							</span>
						</div>
						<button
							className="h-8 rounded-md bg-secondary-400 px-2 py-1 text-primary-900"
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
						{settingValues?.currentTheme ? (
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
							/>
						) : (
							<div></div>
						)}
					</div>
					<div className="!border-0 text-sm text-primary-200">
						Additional themes can be installed by placing them in the /.Themes folder.
					</div>
					{/* <span className="text-sm text-primary-200">Current: {settingValues?.currentTheme?.name} </span> */}
					<hr />
				</div>
			)
		},
		{
			name: 'Editor',
			icon: 'code',
			content: (
				<div className="flex h-full w-full flex-col items-center justify-center">
					<IconContext.Provider value={{ size: '20%', style: { verticalAlign: 'middle' } }}>
						<LuConstruction className="h-32"></LuConstruction>
					</IconContext.Provider>
					<div className="font rounded-lg bg-primary-200 p-4 pb-2 pt-2 text-center text-lg uppercase tracking-widest text-primary-900">
						Under <br /> construction
					</div>
				</div>
			)
		},
		{
			name: 'Keybindings',
			icon: 'keyboard',
			content: (
				<div className="flex h-full w-full flex-col items-center justify-center">
					<IconContext.Provider value={{ size: '20%', style: { verticalAlign: 'middle' } }}>
						<LuConstruction className="h-32"></LuConstruction>
					</IconContext.Provider>
					<div className="font rounded-lg bg-primary-200 p-4 pb-2 pt-2 text-center text-lg uppercase tracking-widest text-primary-900">
						Under <br /> construction
					</div>
				</div>
			)
		},
		{
			name: 'Extensions',
			icon: 'extension',
			content: (
				<div className="flex h-full w-full flex-col items-center justify-center">
					<IconContext.Provider value={{ size: '20%', style: { verticalAlign: 'middle' } }}>
						<LuConstruction className="h-32"></LuConstruction>
					</IconContext.Provider>
					<div className="font rounded-lg bg-primary-200 p-4 pb-2 pt-2 text-center text-lg uppercase tracking-widest text-primary-900">
						Under <br /> construction
					</div>
				</div>
			)
		},
		{
			name: 'Sync',
			icon: 'sync',
			content: (
				<div className="flex h-full w-full flex-col items-center justify-center">
					<IconContext.Provider value={{ size: '20%', style: { verticalAlign: 'middle' } }}>
						<LuConstruction className="h-32"></LuConstruction>
					</IconContext.Provider>
					<div className="font rounded-lg bg-primary-200 p-4 pb-2 pt-2 text-center text-lg uppercase tracking-widest text-primary-900">
						Under <br /> construction
					</div>
				</div>
			)
		}
	];

	const renderSettingsMenu = () => {
		var res: JSX.Element[] = [];
		for (let i = 0; i < settings.length; i++) {
			res.push(
				<button
					className={`flex  w-full items-center justify-start gap-4 rounded  p-4 py-2 hover:border-transparent hover:bg-primary-600 focus:outline-0 ${
						selectedTab === i
							? 'bg-secondary-400 text-primary-900 hover:text-primary-200'
							: 'bg-transparent text-primary-200 hover:text-primary-100'
					}`}
					onClick={() => {
						setSelectedTab(i);
					}}
				>
					<span className="material-symbols-outlined text-base ">{settings[i].icon}</span>
					<span className=" ">{settings[i].name}</span>
				</button>
			);
		}
		return res;
	};

	return (
		<div className="grid h-screen w-full grid-cols-7 items-center justify-start">
			<div className="col-span-2 flex h-screen flex-col items-center justify-start gap-8 border-r-2 border-primary-800  bg-primary-900 p-0 pt-4">
				<div className="flex w-full items-center justify-between pl-4 pr-6">
					<span className=" text-2xl tracking-wider text-primary-200">SETTINGS</span>
				</div>
				<div className="flex w-full flex-col items-start justify-start gap-2 px-4 text-primary-200 ">
					{renderSettingsMenu()}
				</div>
			</div>
			<div
				className="col-span-5 flex h-screen flex-col items-center justify-start border-r-2 border-primary-800
		 bg-primary-900 py-4 pt-20 text-primary-200"
			>
				{settings[selectedTab].content}
			</div>
		</div>
	);
};

export default Settings;
