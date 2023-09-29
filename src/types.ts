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

export type Theme = {
	name: string;
	type: 'Dark' | 'Light';
	primary: {
		'100': [number, number, number];
		'200': [number, number, number];
		'400': [number, number, number];
		'600': [number, number, number];
		'800': [number, number, number];
		'900': [number, number, number];
	};
	secondary: {
		'200': [number, number, number];
		'400': [number, number, number];
		'600': [number, number, number];
	};
	danger: [number, number, number];
	caution: [number, number, number];
	neutral: {
		'100': [number, number, number];
		'200': [number, number, number];
		'400': [number, number, number];
		'600': [number, number, number];
		'800': [number, number, number];
		'900': [number, number, number];
	};
};

export type ThemeHex = {
	name: string;
	type: 'Dark' | 'Light';
	primary: {
		'100': string;
		'200': string;
		'400': string;
		'600': string;
		'800': string;
		'900': string;
	};
	secondary: {
		'200': string;
		'400': string;
		'600': string;
	};
	danger: string;
	caution: string;
	neutral: {
		'100': string;
		'200': string;
		'400': string;
		'600': string;
		'800': string;
		'900': string;
	};
}
