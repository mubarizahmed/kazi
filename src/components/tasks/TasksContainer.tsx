import { Tree, TreeNodeTemplateOptions, TreeSelectionEvent } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import React from 'react';
import { Project, TaskTree } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
	project: TaskTree;
	updateChecked: ((event: TreeSelectionEvent) => void) | undefined;
};

const TasksContainer = (props: Props) => {
	const { project, updateChecked } = props;

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

  if (isDragging){
    return (
      <div
			ref={setNodeRef}
			style={style}
			className=" opacity-40 flex min-w-[25rem] bg-kdark flex-col justify-start overflow-clip rounded-xl border-2 border-kaccent1 align-top drop-shadow-md transition-transform duration-1000 ease-in-out"
		>
			<span {...attributes} {...listeners} className=" opacity-0 bg-kmedium p-4 pb-2 pt-2 text-base uppercase text-klight">
				{project.project_name.slice(0, -3)}
			</span>
			<div className="p-4 opacity-0 pb-8">
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
    )
  }

	return (
		<div
			ref={setNodeRef}
			style={style}
			className=" flex min-w-[25rem] bg-kdark flex-col justify-start overflow-clip rounded-xl border-2 border-kmedium align-top drop-shadow-md"
		>
			<span {...attributes} {...listeners} className="bg-kmedium p-4 pb-2 pt-2 text-base uppercase text-klight">
				{project.project_name.slice(0, -3)}
			</span>
			<div className="p-4 bg-kdark pb-8">
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
};

export default TasksContainer;
