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

export type TaskTreeNode = {
	id: string;
	key: string;
	label: string;
	checked: boolean;
	dueDate?: Date;
	priority?: number;
	parent_id?: string;
	project_id: number;
	level: number;
	icon: string;
	selectable: boolean;
	children?: TaskTreeNode[];
}

export type TaskTree = {
	project_id: number;
	project_path: string;
	project_name: string;
	tasks: TaskTreeNode[];
	checkedTasks: CheckedTasks;
}

export type CheckedTasks = {
	[key: string]: { checked: boolean; partialChecked: boolean };
};

export type Project = {
	label: string;
	children: Task[];
	checkedTasks: CheckedTasks;
};

export type ProjectType = {
	id: number;
	name: string;
	path: string;
	type: 'file' | 'directory';
	modified: number;
	parent_id?: number;
}