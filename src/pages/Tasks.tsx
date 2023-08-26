import React, { ReactNode, useEffect, useState } from 'react';
import { Tree, TreeNodeTemplateOptions, TreeTogglerTemplateOptions } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import 'primeicons/primeicons.css';
//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';

//core
import 'primereact/resources/primereact.min.css';

import { Project, TaskTree } from '../types';

type Props = {};

const Tasks = (props: Props) => {
	const [projects, setProjects] = useState<TaskTree[]>([]);

	async function startScan() {
		console.log(await window.electronAPI.updateTaskTree());
	}

	async function getTasks() {
		console.log(await window.electronAPI.loadTaskTree());
	}

	const load = async () => {
		console.log('loaded');
		setProjects(await window.electronAPI.loadTaskTree());
	};

	useEffect(() => {
		load();
	}, []);

	useEffect(() => {
		console.log(projects);
	}, [projects]);

	// var projectTrees = () => {
	// 	var res: ReactNode[] = [];
	// 	if (projects.length > 0) {
	// 		projects.map((project) => {
	// 			res.push(<Tree value={project.children} className="md:w-30rem w-full" />);
	// 		});
	// 	} else {
	// 		res.push(<div>No Tasks</div>);
	// 	}
	// 	return res;
	// };

	var updateChecked = (event: any) => {
		console.log(event);
	};

	const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
		if (node.date) {
			return (
				<div className="flex flex-row items-center justify-start gap-2 ">
					<span className={options.className}>{node.label}</span>
					<div className="flex items-center justify-center rounded bg-slate-500 p-1">
						<span className="text-xs text-white">
							{new Date(node.date).toDateString().slice(4, 10)}
						</span>
					</div>
				</div>
			);
		}

		return (
			<div className="flex flex-row items-center justify-start gap-1">
				<span className={options.className}>{node.label}</span>
			</div>
		);
	};

	return (
		<div className="flex h-screen w-full flex-col  gap-4 bg-kdark p-4">
			<div className="flex w-full items-center justify-between pl-4 pr-6">
				<span className=" text-2xl tracking-wider text-klight">TASKS</span>

				{/* button named start scan */}
				<div className="flex h-full items-center gap-2">
					<button
						className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 hover:bg-kaccent1"
						onClick={getTasks}
					>
						<span className="pi pi-arrow-down text-base text-klight hover:text-white"></span>
					</button>
					<button
						className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 hover:bg-kaccent1"
						onClick={startScan}
					>
						<span className="pi pi-refresh text-base text-klight hover:text-white"></span>
					</button>
				</div>
			</div>
			<div className="w-full overflow-y-scroll pl-4 pr-3">
				<div className="flex flex-row flex-wrap justify-center gap-4 align-top">
					{/* {projectTrees} */}
					{projects.length > 0 ? (
						projects.map((project) => {
							return (
								<div className=" flex min-w-[25rem] flex-col justify-start overflow-clip rounded-xl border-2 border-kmedium align-top drop-shadow-md">
									<span className="bg-kmedium text-base p-4 pt-2 pb-2 uppercase text-klight">
										{project.project_name.slice(0, -3)}
									</span>
									<div className='p-4 pb-8'>
									<Tree
										value={project.tasks}
										selectionMode="checkbox"
										onSelectionChange={updateChecked}
										className="md:w-30rem w-full"
										selectionKeys={project.checkedTasks}
										nodeTemplate={nodeTemplate}
									/>
									</div>
								</div>
							);
						})
					) : (
						<p>Test</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Tasks;
