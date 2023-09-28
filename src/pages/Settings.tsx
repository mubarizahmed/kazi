import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { LuConstruction } from 'react-icons/lu';
import { Theme } from '@/types';
import { IconContext } from 'react-icons';
import { InputText } from 'primereact/inputtext';

const Settings = () => {
	const [selectedTab, setSelectedTab] = useState(0);
	const [settingValues, setSettingValues] = useState({});
	const [themes, setThemes] = useState([]);
	const [dateFormat, setDateFormat] = useState('');
	const [dateFormatValid, setDateFormatValid] = useState(true);

	const load = async () => {
		console.log('loaded');
		await window.electronAPI.loadSettings().then((res) => {
			setSettingValues(res[0]);
			setThemes(res[1]);
			setDateFormat(res[0].dateFormat);
			console.log(res);
		});
	};

	useEffect(() => {
		load();
	}, []);

	const validateDateFormat = () => {
		const pattern =
		/(?=^[^d]*d{2}[^d]*$)(?=^[^m]*m{2}[^m]*$)(?=^[^y]*y{4}[^y]*$)(?=^[^dd]*dd{1}[^dd]*$)(?=^[^mm]*mm{1}[^mm]*$)(?=^[^yyyy]*yyyy{1}[^yyyy]*$)/ig;

		console.log(dateFormat.search(pattern));
			console.log(pattern.test(dateFormat));
		// Test if the pattern matches the dateFormat string
		if (pattern.test(dateFormat)) {
			console.log('valid');
			setDateFormatValid(true);
			window.electronAPI.changeDateFormat(dateFormat).then((res) => {
				setSettingValues(res);
			});
		} else {
			console.log('invalid');
			setDateFormatValid(false);
		}
	};

	const settings = [
		{
			name: 'General',
			icon: 'settings',
			key: 'general',
			content: (
				<div className="flex w-full flex-col items-start justify-start gap-2 pl-6 pr-6">
					<div>
						<h3 className="text-lg font-medium">General</h3>
						<p className="text-sm text-primary-400">Change general settings of the app.</p>
					</div>
					<hr />

					<div className="mb-2 flex w-full flex-col gap-2">
						<span className="text font-medium">Workspace Directory</span>

						<div className="flex w-full items-stretch">
							<div className="min-w-[30vw] rounded-l-md bg-primary-800 p-2 text-sm text-primary-200">
								{settingValues.userDirectory}
							</div>
							<button
								className=" rounded-none rounded-r-md border-0 bg-secondary-400 p-2 text-sm text-primary-900"
								onClick={async () => {
									setSettingValues(await window.electronAPI.changeUserDirectory());
								}}
							>
								Change
							</button>
						</div>
						<p className=" text-sm text-primary-400">
							The directory where all your notes will be stored.
						</p>
					</div>
					<div className="flex w-full flex-col gap-2">
						<span className="text font-medium">Date Format</span>

						<div className="flex w-full items-stretch">
							<InputText
								className={
									'min-w-[30vw] rounded-none rounded-l-md bg-primary-800 p-2 text-sm ' +
									(dateFormatValid
										? 'text-primary-200'
										: 'shadow-[0_0_0_0.2rem_rgba(var(--color-danger),0.4)] text-danger ')
								}
								value={dateFormat}
								onChange={(e) => {
									setDateFormat(e.currentTarget.value);
								}}
								spellCheck={false}
							/>
							

							<button
								className=" rounded-none rounded-r-md border-0 bg-secondary-400 p-2 text-sm text-primary-900"
								onClick={validateDateFormat}
							>
								Change
							</button>
						</div>
						<p className=" text-sm text-primary-400">
							The date format used to parse notes for tasks. It needs to contain exactly one set of each DD, MM, and YYYY.
						</p>
					</div>
				</div>
			)
		},
		{
			name: 'Appearance',
			icon: 'palette',
			key: 'appearance',
			content: (
				<div className="flex w-full flex-col items-start justify-start gap-2 pl-6 pr-6">
					<div>
						<h3 className="text-lg font-medium">Appearance</h3>
						<p className="text-muted-foreground text-sm">Customize the appearance of the app.</p>
					</div>
					<hr />

					<div className="flex flex-col gap-2">
						<span className="text font-medium">Theme</span>
						<p className="text-sm text-primary-200 opacity-80">
							Select a theme. Additional themes can be installed by placing them in the /.Themes
							folder of your workspace directory.
						</p>
						<div className="flex flex-wrap items-center justify-start gap-4 pt-2">
							{themes.map((theme: Theme) => {
								return (
									<div className="flex flex-col">
										<div
											className={
												'items-center rounded-md border-2 p-1 hover:border-secondary-400 ' +
												(JSON.stringify(settingValues.currentTheme) === JSON.stringify(theme)
													? 'border-secondary-400'
													: 'border-primary-200 hover:bg-secondary-400 hover:bg-opacity-30')
											}
											onClick={() => {
												window.electronAPI.changeTheme(theme).then((res) => {
													setSettingValues(res);
												});
											}}
										>
											<div
												className="w-32 space-y-2 rounded-md p-1"
												style={{
													backgroundColor: `rgb(${theme.primary[900][0]}, ${theme.primary[900][1]}, ${theme.primary[900][2]})`
												}}
											>
												<div
													className="space-y-1 rounded-md p-1 shadow-sm"
													style={{
														backgroundColor: `rgb(${theme.primary[800][0]}, ${theme.primary[800][1]}, ${theme.primary[800][2]})`
													}}
												>
													<div
														className="h-1 w-[60%] rounded-lg "
														style={{
															backgroundColor: `rgb(${theme.secondary[400][0]}, ${theme.secondary[400][1]}, ${theme.secondary[400][2]})`
														}}
													/>
													<div
														className="h-1 w-[80%] rounded-lg"
														style={{
															backgroundColor: `rgb(${theme.primary[200][0]}, ${theme.primary[200][1]}, ${theme.primary[200][2]})`
														}}
													/>
												</div>
												<div
													className="flex items-center space-x-1 rounded-md  p-1 shadow-sm"
													style={{
														backgroundColor: `rgb(${theme.primary[800][0]}, ${theme.primary[800][1]}, ${theme.primary[800][2]})`
													}}
												>
													<div
														className="h-2 w-2 rounded-full"
														style={{
															backgroundColor: `rgb(${theme.danger[0]}, ${theme.danger[1]}, ${theme.danger[2]})`
														}}
													/>
													<div
														className="h-1 w-[100%] rounded-lg"
														style={{
															backgroundColor: `rgb(${theme.primary[100][0]}, ${theme.primary[100][1]}, ${theme.primary[100][2]})`
														}}
													/>
												</div>
												<div
													className="flex items-center space-x-1 rounded-md  p-1 shadow-sm"
													style={{
														backgroundColor: `rgb(${theme.primary[800][0]}, ${theme.primary[800][1]}, ${theme.primary[800][2]})`
													}}
												>
													<div
														className="h-2 w-2 rounded-full"
														style={{
															backgroundColor: `rgb(${theme.caution[0]}, ${theme.caution[1]}, ${theme.caution[2]})`
														}}
													/>
													<div
														className="h-1 w-[100%] rounded-lg"
														style={{
															backgroundColor: `rgb(${theme.primary[600][0]}, ${theme.primary[600][1]}, ${theme.primary[600][2]})`
														}}
													/>
												</div>
											</div>
										</div>
										<span
											className={
												'block w-full p-2 text-center font-normal ' +
												(JSON.stringify(settingValues.currentTheme) === JSON.stringify(theme)
													? 'text-secondary-400'
													: '')
											}
										>
											{theme.name}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* <span className="text-sm text-primary-200">Current: {settingValues?.currentTheme?.name} </span> */}
				</div>
			)
		},
		{
			name: 'Editor',
			icon: 'code',
			key: 'editor',
			content: (
				<div className="!under-construction flex h-full w-full flex-col items-center justify-center">
					<IconContext.Provider value={{ size: '20%', style: { verticalAlign: 'middle' } }}>
						<LuConstruction className=" h-32"></LuConstruction>
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
			key: 'keybindings',
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
			key: 'extensions',
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
			key: 'sync',
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
					key={i}
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
			<div className="col-span-2 flex h-screen flex-col items-center justify-start gap-6 border-r-2 border-primary-800  bg-primary-900 pt-5">
				<div className="flex w-full items-center justify-between px-4">
					<span className=" text-3xl font-light uppercase tracking-widest text-primary-200">
						Settings
					</span>
				</div>
				<div className="flex w-full flex-col items-start justify-start gap-2 px-4 text-primary-200 ">
					{renderSettingsMenu()}
				</div>
			</div>
			<div
				className="col-span-5 flex h-screen flex-col items-center justify-start border-r-2 border-primary-800
		 bg-primary-900 py-4 pt-6 text-primary-200"
			>
				{settings[selectedTab].content}
			</div>
		</div>
	);
};

export default Settings;
