import React, { ReactNode, useEffect, useState } from 'react';
import { Tree, TreeNodeTemplateOptions, TreeTogglerTemplateOptions } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import 'primeicons/primeicons.css';
//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';

//core
import 'primereact/resources/primereact.min.css';

import { Project } from '../types';

type Props = {};

const Tasks = (props: Props) => {
	const [projects, setProjects] = useState<Project[]>([]);

	function startScan() {
		window.electronAPI.startTaskScan();
	}

	const load = async () => {
		console.log('loaded');
		setProjects(await window.electronAPI.startTaskScan());
	};

	useEffect(() => {
		load();
	}, []);

	useEffect(() => {
		console.log(projects);
	}, [projects]);

	var projectTrees = () => {
		var res: ReactNode[] = [];
		if (projects.length > 0) {
			projects.map((project) => {
				res.push(<Tree value={project.children} className="md:w-30rem w-full" />);
			});
		} else {
			res.push(<div>No Tasks</div>);
		}
		return res;
	};

	var updateChecked = (event: any) => {
		console.log(event);
	};

	useEffect(() => {
		console.log(projects);
	}, [projects]);

	const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
		if (node.date) {
			return (
				<div className="flex flex-row justify-start gap-2 items-center ">
					<span className={options.className}>{node.label}</span>
					<div className="bg-slate-500 flex items-center justify-center p-1 rounded">
						<span className="text-xs text-white">{new Date(node.date).toDateString().slice(4, 10)}</span>
					</div>
				</div>
			);
		}

		return (
			<div className="flex flex-row justify-start gap-1 items-center">
				<span className={options.className}>{node.label}</span>
			</div>
		);
	};

	return (
		<div className="flex h-screen w-full flex-col  bg-kdark p-4">
			<div className="flex w-full items-center justify-between pl-4 pr-6">
				<span className=" text-2xl tracking-wider text-klight">TASKS</span>

				{/* button named start scan */}
				<button
					className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 hover:bg-kaccent1"
					onClick={startScan}
				>
					<span className="material-symbols-outlined text-base text-klight hover:text-white">
						refresh
					</span>
				</button>
			</div>
			<div className="w-full overflow-y-scroll pl-4 pr-3">
				<div className="card flex justify-center">
					{/* {projectTrees} */}
					{projects.length > 0 ? (
						<Tree
							value={projects[0].children}
							selectionMode="checkbox"
							onSelectionChange={updateChecked}
							className="md:w-30rem w-full"
							selectionKeys={projects[0].checkedTasks}
							nodeTemplate={nodeTemplate}
						/>
					) : (
						<p>Test</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Tasks;
