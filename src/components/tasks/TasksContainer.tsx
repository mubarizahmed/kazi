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
};

const TasksContainer = (props: Props) => {
	const { project, checkTask } = props;
	const [filterValue, setFilterValue] = useState(0);
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
	}, [filterValue]);



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
				className=" flex min-w-[30vw] max-w-[35vw] flex-col justify-start overflow-clip rounded-xl border-2 border-kaccent1 bg-kdark align-top opacity-40 drop-shadow-md transition-transform duration-1000 ease-in-out"
			>
				<span
					{...attributes}
					{...listeners}
					className=" bg-kmedium p-4 pb-2 pt-2 text-base uppercase text-klight opacity-0"
				>
					{project.project_name.slice(0, -3)}
				</span>
				<div className="flex flex-col gap-2 p-2 pb-4 opacity-0">
					{project.tasks.map((task) => {
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
			className=" flex w-[35vw] flex-col justify-start overflow-clip rounded-xl border-2 border-kmedium bg-kdark align-top drop-shadow-md"
		>
			<div className="flex flex-col bg-kmedium p-3">
				<div className="flex w-full pb-1 items-center justify-between gap-2">
					<span className="bg-kmedium  text-base uppercase text-klight">
						{project.project_name.slice(0, -3)}
					</span>
					<IconContext.Provider value={{ size: '1em', style: { verticalAlign: 'middle' } }}>
						<div
							{...attributes}
							{...listeners}
							className={
								'flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 text-klight hover:text-kaccent1'
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
								? 'bg-kaccent1 text-kdark'
								: 'border-klight bg-kmedium text-klight hover:border-kaccent1 hover:text-kaccent1')
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
								? 'bg-kaccent1 text-kdark'
								: 'border-klight bg-kmedium text-klight hover:border-kaccent1 hover:text-kaccent1')
						}
						onClick={() => {
							filterToggle(2);
						}}
					>
						Today
					</button>
				</div>
			</div>
			<div className="flex max-h-[60vh] flex-col gap-2 overflow-x-hidden overflow-y-scroll bg-kdark p-3 pr-0">
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
					return <Task task={task} child={false} key={task.id}  checkTask={checkTask}></Task>;
				})}
			</div>
		</div>
	);
};

export default TasksContainer;
