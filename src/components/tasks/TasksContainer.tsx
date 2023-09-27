import { Tree, TreeNodeTemplateOptions, TreeSelectionEvent } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import React, { useEffect, useRef, useState } from 'react';
import { Project, TaskTree, TaskTreeNode } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Task from './Task';
import { IconContext } from 'react-icons';
import { MdDragIndicator } from 'react-icons/md';

type Props = {
	project: TaskTree;
	// updateChecked: ((event: TreeSelectionEvent) => void) | undefined;
	checkTask: Function;
	filter: number;
};

const TasksContainer = (props: Props) => {
	const { project, checkTask, filter } = props;
	const [filterValue, setFilterValue] = useState(filter);
	const [filterBy, setFilterBy] = useState('');

	const treeRef = useRef(null);

	const filterCompleted = (tasks: TaskTreeNode[]) => {
		let filtered: TaskTreeNode[] = [];
		tasks.forEach((task) => {
			let t: TaskTreeNode = { ...task };
			t.children = filterCompleted(task.children || []);
			if (task.checked === 0 || t.children.length > 0) {
				filtered.push(t);
			}
		});
		return filtered;
	};

	const filterDueToday = (tasks: TaskTreeNode[]) => {
		let filtered: TaskTreeNode[] = [];
		let tomorrow = new Date(new Date().toISOString().slice(0, 19));
		tomorrow.setDate(tomorrow.getDate() + 1);

		tasks.forEach((task) => {
			let t: TaskTreeNode = { ...task };

			if (task.dueDate && new Date(task.dueDate) < tomorrow) {
				filtered.push(t);
			} else {
				t.children = filterDueToday(task.children || []);
				if (t.children.length > 0) {
					filtered.push(t);
				}
			}
		});
		return filtered;
	};

	const [incomplete, setIncomplete] = useState(filterCompleted(project.tasks));
	const [dueToday, setDueToday] = useState(filterDueToday(incomplete));
	const [showTasks, setShowTasks] = useState(incomplete);

	const filterToggle = (val: number) => {
		if (filterValue === val) {
			setFilterValue(0);
		} else {
			setFilterValue(val);
		}
	};

	useEffect(() => {
		if (filterValue === 0) {
			setShowTasks(incomplete);
		} else if (filterValue === 1) {
			setShowTasks(project.tasks);
		} else if (filterValue === 2) {
			setShowTasks(dueToday);
		}
		console.log('showTasks updated');
	}, [filterValue, incomplete, project, dueToday]);

	useEffect(() => {
		setIncomplete(filterCompleted(project.tasks));
	}, [project]);

	useEffect(() => {
		setFilterValue(filter);
	}, [filter]);

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: project.project_id,
		data: {
			type: 'project',
			project
		}
	});

	const style = {
		// transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		transition,
		transform: CSS.Translate.toString(transform)
	};

	const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
		if (node.dueDate) {
			return (
				<div className="flex flex-row items-center justify-start gap-2 ">
					<span className={options.className}>{node.label}</span>
					<div className="flex items-center justify-center rounded bg-slate-500 p-1">
						<span className="text-xs text-white">
							{new Date(node.dueDate).toDateString().slice(4, 10)}
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

	useEffect(() => {
		console.log(project.project_id, incomplete);
	});

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className=" flex flex-col justify-start overflow-clip rounded-xl  border-2 border-secondary-400 bg-primary-900 align-top opacity-50 drop-shadow-md [width:clamp(20rem,35vw,24rem)]"
			>
				<div className="flex flex-col bg-primary-800 p-3 opacity-0">
					<div className="flex w-full items-center justify-between gap-2 pb-1">
						<span className="bg-primary-800  text-base uppercase text-primary-200">
							{project.project_name.slice(0, -3)}
						</span>
					</div>
					<div className="flex w-full items-center justify-start gap-2">
						<button
							className={
								'rounded p-1 text-xs  ' +
								(filterValue === 1
									? 'bg-secondary-400 text-primary-900'
									: 'border-primary-200 bg-primary-800 text-primary-200 hover:border-secondary-400 hover:text-secondary-400')
							}
							onClick={() => {
								filterToggle(1);
							}}
						>
							Completed
						</button>
						<button
							className={
								'rounded p-1 text-xs  ' +
								(filterValue === 2
									? 'bg-secondary-400 text-primary-900'
									: 'border-primary-200 bg-primary-800 text-primary-200 hover:border-secondary-400 hover:text-secondary-400')
							}
							onClick={() => {
								filterToggle(2);
							}}
						>
							Today
						</button>
					</div>
				</div>
				<div className="flex max-h-[60vh]  flex-col gap-2 overflow-x-hidden overflow-y-scroll bg-primary-900 p-3 pr-0 opacity-0">
					{showTasks.map((task) => {
						return <Task task={task} child={false} key={task.id} checkTask={checkTask}></Task>;
					})}
				</div>
			</div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className=" flex flex-col justify-start overflow-clip rounded-xl border-2 border-primary-800 bg-primary-900 align-top drop-shadow-lg [width:clamp(20rem,35vw,24rem)]"
		>
			<div className="flex flex-col bg-primary-800 p-3">
				<div className="flex w-full items-center justify-between gap-2 pb-1">
					<span className="bg-primary-800  text-base font-medium capitalize tracking-tight text-primary-200">
						{project.project_name.slice(0, -3)}
					</span>
					<IconContext.Provider value={{ size: '1em', style: { verticalAlign: 'middle' } }}>
						<div
							{...attributes}
							{...listeners}
							className={
								'flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-transparent p-0 text-primary-200 hover:text-secondary-400'
							}
						>
							<MdDragIndicator />
						</div>
					</IconContext.Provider>
				</div>
				<div className="flex w-full items-center justify-start gap-2">
					<button
						className={
							'rounded p-1 text-xs  ' +
							(filterValue === 1
								? 'bg-secondary-400 text-primary-900'
								: ' bg-primary-900 text-primary-200 hover:border-secondary-400 hover:text-secondary-400')
						}
						onClick={() => {
							filterToggle(1);
						}}
					>
						Completed
					</button>
					<button
						className={
							'rounded p-1 text-xs  ' +
							(filterValue === 2
								? 'bg-secondary-400 text-primary-900'
								: ' bg-primary-900 text-primary-200 hover:border-secondary-400 hover:text-secondary-400')
						}
						onClick={() => {
							filterToggle(2);
						}}
					>
						Today
					</button>
				</div>
			</div>
			<div className="flex max-h-[60vh] flex-col gap-2 overflow-x-hidden overflow-y-scroll bg-primary-900 p-3 pr-0">
				{/* <Tree
					ref={treeRef}
					value={project.tasks}
					selectionMode="checkbox"
					onSelectionChange={updateChecked}
					className="md:w-30rem w-full"
					selectionKeys={project.checkedTasks}
					nodeTemplate={nodeTemplate}
					filterBy={filterBy}
					filterValue={filterValue}
					filter
				/> */}
				{showTasks.map((task) => {
					return <Task task={task} child={false} key={task.id} checkTask={checkTask}></Task>;
				})}
			</div>
		</div>
	);
};

export default TasksContainer;
