import React, { ReactNode, useEffect, useState } from 'react';
import { Tree } from 'primereact/tree';

import 'primeicons/primeicons.css';

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

	useEffect(() => {
		console.log(projects);
	}, [projects]);
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
				<div className="card flex justify-content-center">
					{/* {projectTrees} */}
					{projects.length > 0 ? (
						<Tree value={projects[0].children} className="md:w-30rem w-full" />
					) : (
						<p>Test</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Tasks;
