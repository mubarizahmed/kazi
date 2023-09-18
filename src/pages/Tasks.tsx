import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Tree, TreeNodeTemplateOptions, TreeTogglerTemplateOptions } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

//icons
import 'primeicons/primeicons.css';
//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';

//core
import 'primereact/resources/primereact.min.css';

import { Project, TaskTree } from '../types';
import { TasksContainer } from '@/components';
import { createPortal } from 'react-dom';

type Props = {};

const Tasks = (props: Props) => {
	const [projects, setProjects] = useState<TaskTree[]>([]);
	const projectsId = useMemo(() => projects.map((project) => project.project_id), [projects]);
	const [activeProject, setActiveProject] = useState<TaskTree | null>(null);

	const sortProjects = (unsortedProjects: TaskTree[], ids: number[]) => {
		return unsortedProjects.sort((a:TaskTree, b:TaskTree) => {
			const indexA = ids.indexOf(a.project_id); // Assuming 'id' is the property containing project IDs
			const indexB = ids.indexOf(b.project_id);

			// Check if a or b is not found in projectIds
			if (indexA === -1 && indexB === -1) {
				// If both are not found, maintain their original order
				return 0;
			} else if (indexA === -1) {
				// If 'a' is not found, move 'a' to the end
				return 1;
			} else if (indexB === -1) {
				// If 'b' is not found, move 'b' to the end
				return -1;
			} else {
				// Compare based on the order of projectIds
				return indexA - indexB;
			}
		});
	}

	async function startScan() {
		let taskTree = await window.electronAPI.updateTaskTree();
		console.log(taskTree);
		setProjects(sortProjects(taskTree, projectsId));
	}

	async function getTasks() {
		let taskTree =await window.electronAPI.loadTaskTree();
		console.log(taskTree);
		setProjects(sortProjects(taskTree, projectsId));
	}

	
	const load = async () => {
		let po = sessionStorage.getItem('kazi-projects-order');
		if (po !== null && po !== '') {
			let ids = JSON.parse(po);
			let unsortedProjects = await window.electronAPI.loadTaskTree();
			console.log("sorting",ids)
			setProjects(sortProjects(unsortedProjects, ids));
		} else {
			setProjects(await window.electronAPI.loadTaskTree());
		}

		console.log('loaded');
	};

	useEffect(() => {
		load();
	}, []);

	useEffect(() => {
		console.log(projects);
	}, [projects]);

	useEffect(() => {
		sessionStorage.setItem('kazi-projects-order', JSON.stringify(projectsId));
	}, [projectsId]);
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

	const onDragStart = (event: DragStartEvent) => {
		console.log(event);
		if (event.active.data.current?.type === 'project') {
			setActiveProject(event.active.data.current.project);
		}
	};

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;

		if (active.id === over.id) return;

		setProjects((projects) => {
			const oldIndex = projects.findIndex((project) => project.project_id === active.id);
			const newIndex = projects.findIndex((project) => project.project_id === over.id);

			// const newProjects = [...projects];
			// newProjects.splice(oldIndex, 1);
			// newProjects.splice(newIndex, 0, projects[oldIndex]);

			return arrayMove(projects, oldIndex, newIndex);
		});
	};
	// const headerTemplate
	// header template with index prop
	// useState array for filter text and filter attributes
	// filter function

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
			<DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
				<div className="flex h-full w-full flex-wrap gap-4 overflow-y-scroll pl-4 pr-3">
					{/* {projectTrees} */}
					<SortableContext items={projectsId}>
						{projects.length > 0 ? (
							projects.map((proj) => {
								return <TasksContainer project={proj} updateChecked={updateChecked} />;
							})
						) : (
							<p>Test</p>
						)}
					</SortableContext>
				</div>

				<DragOverlay>
					{activeProject && (
						<TasksContainer project={activeProject} updateChecked={updateChecked} />
					)}
				</DragOverlay>
			</DndContext>
		</div>
	);
};

export default Tasks;
