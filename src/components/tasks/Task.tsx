import { TaskTreeNode } from '@/types';
import React, { useEffect, useState } from 'react';

const Task = ({ task, child = false, checkTask }: { task: TaskTreeNode; child: boolean; checkTask: any }) => {
	const [checked, setChecked] = useState(task.checked === 1);
	const [children, setChildren] = useState(false);
	const [completedChildren, setCompletedChildren] = useState(0);
	const [dueDate, setDueDate] = useState<Date | null>(new Date(task.dueDate) || null);
	const [overdue, setOverdue] = useState(false);

	useEffect(() => {
		let count = 0;
		task.children?.forEach((child) => {
			if (child.checked === 1) {
				count++;
			}
		});
		setCompletedChildren(count);

		if (dueDate) {
			let tomorrow = new Date(new Date().toISOString().slice(0, 19));
			tomorrow.setDate(tomorrow.getDate() + 1);
			console.log(tomorrow);

			setOverdue(dueDate < tomorrow);
		}
	}, [task]);

	const toggleChildren = () => {
		setChildren(!children);
		console.log(task);
	};

	useEffect(() => {
		setChecked(task.checked === 1);
	}, [task.checked]);



	return (
		<div
			className={
				'flex w-full flex-col items-start justify-start gap-1 pb-2 pl-2 pt-2 ' +
				(child ? '' : 'rounded-lg border-2 border-kmedium')
			}
		>
			<div className="flex w-full items-center justify-start gap-1 pr-2">
				{/* {task.children && task.children.length > 0 ? (
					<button
						className={
							' flex h-5 flex-shrink-0 place-content-center place-items-center bg-transparent p-0 hover:border-transparent hover:text-kaccent1 ' +
							'pi pi-chevron-' +
							(children ? 'down' : 'right')
						}
						onClick={toggleChildren}
					></button>
				) : (
					<span className="mr-0.5 w-4 flex-shrink-0" />
				)} */}
				<button
					className={
						'pi pi-check h-5 w-5 flex-shrink-0 rounded-full  p-0 text-xs ' +
						(checked
							? 'bg-kaccent1 text-kdark text-opacity-100 hover:text-opacity-0'
							: 'bg-klighter text-kaccent1 text-opacity-0 hover:text-opacity-100')
					}
					onClick={() => checkTask(task,checked)}
				></button>
				<div className="flex w-full flex-col">
					<span className="max-h-10 overflow-hidden pl-1 text-sm text-klight">{task.label}</span>
					<div className=" w-full grid grid-cols-2">
						{task.dueDate && (
							<span className={'pl-1 text-xs col-start-1 ' + (overdue ? 'text-red-500' : 'text-klight')}>
								{new Date(task.dueDate).toDateString().slice(4, 10)}
							</span>
						)}
						{task.children && task.children.length > 0 && (
							<span className="pl-1 col-start-2 justify-self-end text-xs text-klight ">
								<button
									className={
										'items-start bg-transparent border-0 p-0 text-xs hover:border-transparent hover:text-kaccent1 mr-1 ' +
										'pi pi-chevron-' +
										(children ? 'down' : 'right')
									}
									onClick={toggleChildren}
								></button>
								{/* <span className="pi pi-list pr-2 text-xs"></span> */}
								{completedChildren + '/' + task.children?.length}
							</span>
						)}
						{/* <span className="pl-1 text-xs text-klight">{task.priority}</span> */}
					</div>
				</div>
			</div>

			{children && (
				<div className="ml-2 flex w-[calc(100%-0.5rem)] flex-col box-border gap-1 rounded-l-lg  border-kmedium border-opacity-0 bg-kmedium hover:border-opacity-100">
					{task.children?.map((child) => {
						return <Task task={child} child={true} checkTask={checkTask}/>;
					})}
				</div>
			)}
		</div>
	);
};

export default Task;
