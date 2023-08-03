export type FileTreeType = {
	name: string;
	type: 'file' | 'directory';
	path: string;
	children?: FileTreeType[];
};

export type Task = {
	key: string;
	label: string;
	checked: boolean;
	children?: Task[];
};

export type CheckedTasks = {
	[key: string]: { checked: boolean; partialChecked: boolean };
};

export type Project = {
	label: string;
	children: Task[];
	checkedTasks: CheckedTasks;
};
