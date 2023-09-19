import { Tree, TreeNodeTemplateOptions, TreeSelectionEvent } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import React, { useRef, useState } from 'react';
import { Project, TaskTree } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Task from './Task';

type Props = {
	project: TaskTree;
	updateChecked: ((event: TreeSelectionEvent) => void) | undefined;
};

const TasksContainer = (props: Props) => {
	const { project, updateChecked } = props;
	const [filterValue, setFilterValue] = useState('');
	const [filterBy, setFilterBy] = useState('');

	const treeRef = useRef(null);

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
						return <Task task={task} child={false} key={task.id}></Task>;
					})}
				</div>
			</div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className=" flex min-w-[30vw] max-w-[35vw] flex-col justify-start overflow-clip rounded-xl border-2 border-kmedium bg-kdark align-top drop-shadow-md"
		>
			<span
				{...attributes}
				{...listeners}
				className="bg-kmedium p-4 pb-2 pt-2 text-base uppercase text-klight"
			>
				{project.project_name.slice(0, -3)}
			</span>
			<div className="flex w-full items-center justify-start gap-2 p-2">
				<button
					className="rounded-full bg-kmedium p-2 text-xs hover:bg-kaccent1"
					onClick={() => {
						if (filterValue !== '') {
							setFilterValue('');
							setFilterBy('');
							treeRef.current?.filter('');
						} else {
							setFilterValue('0');
							setFilterBy('checked');
							treeRef.current?.filter('0');
						}
					}}
				>
					Completed
				</button>
			</div>
			<div className="flex flex-col max-h-[60vh] overflow-y-scroll gap-2 bg-kdark p-2 pb-4 ">
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
				{project.tasks.map((task) => {
					return <Task task={task} child={false} key={task.id}></Task>;
				})}
			</div>
		</div>
	);
};

export default TasksContainer;
