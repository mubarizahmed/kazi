export type FileTreeType = {
	name: string;
	type: 'file' | 'directory';
	path: string;
	children?: FileTreeType[];
};

export type FileTreeNodeType = {
	id: number;
	key: string;
	label: string;
	path: string;
	type: 'file' | 'directory';
	modified: number;
	level: number;
	icon: string;
	selectable: boolean;
	children?: FileTreeNodeType[];
};

export type Task = {
	key: string;
	label: string;
  date?: Date;
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
