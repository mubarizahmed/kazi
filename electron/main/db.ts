import sqlite3 from 'sqlite3';
import { treeSort } from './fileScanner';
import { CheckedTasks, FileTreeNodeType, ProjectType, TaskTree, TaskTreeNode } from '@/types';
import { taskTreeSort } from './taskScanner';

var db: sqlite3.Database;
var updatedProjects: number[] = [];

export const createDb = (path: string) => {
	db = new sqlite3.Database(path, (err) => {
		if (err) {
			console.error(err.message);
		} else {
			console.log('Connected to the kazi database.');
		}
	});

	db.serialize(() => {
		// Create projects table if it doesn't exist
		// db.run(`DROP TABLE IF EXISTS projects`)
		db.run(
			`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER UNIQUE PRIMARY KEY,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        type TEXT NOT NULL,
        modified INTEGER NOT NULL,
        parent_id INTEGER
      )`,
			(err) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log('Created project table.');
				}
			}
		);
		db.run(
			`CREATE TABLE IF NOT EXISTS tasks (
      id TEXT,
      name TEXT NOT NULL,
      checked INTEGER NOT NULL,
			project_id INTEGER NOT NULL,
      dueDate TEXT,
			priority INTEGER,
      parent_id TEXT,
			PRIMARY KEY(id, project_id)
    )`,
			(err) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log('Created tasks table.');
				}
			}
		);
	});

	return db;
};

export const getProject = (id: number) => {
	return new Promise<ProjectType>((resolve, reject) => {
		db.get(`SELECT * FROM projects WHERE id = ?`, [id], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
}

export const getProjects = () => {
	return new Promise((resolve, reject) => {
		db.all(`SELECT * FROM projects`, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

export const getMarkdownProjects = () => {
	return new Promise<any>((resolve, reject) => {
		db.all(`SELECT * FROM projects WHERE type = 'file'`, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

export const createProject = (
	id: number,
	name: string,
	path: string,
	type: string,
	modifiedMs: number,
	parent_id?: number
) => {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO projects (id, name, path, type, modified, parent_id) VALUES (?, ?, ?, ? ?, ?)`,
			[id, name, path, type, modifiedMs, parent_id],
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			}
		);
	});
};

export const upsertProject = (
	id: number,
	name: string,
	path: string,
	type: string,
	modifiedMs: number,
	parent_id: number = 0
) => {
	db.run(
		`INSERT INTO projects (
    id, name, path, type, modified, parent_id
    ) 
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE 
    SET name = ?, path = ?, type = ?, modified = ?, parent_id = ?`,
		[id, name, path, type, modifiedMs, parent_id, name, path, type, modifiedMs, parent_id],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				// console.log(`Row(s) updated: ${this.changes}`);
			}
		}
	);
	updatedProjects.push(id);
};

export const deleteNonexistentProjects = () => {
	console.log(updatedProjects);
	console.log(updatedProjects.length);
	const placeholders = updatedProjects.map(() => '?').join(', ');
	const ids = updatedProjects.map((id) => id).join(', ');
	console.log(ids);
	console.log(placeholders);
	// IN VALUES ?? maybe
	// db.run(`DELETE FROM projects WHERE id NOT IN (${placeholders})`, [updatedProjects], (err) => {
	// 	if (err) {
	// 		console.log(err);
	// 		return;
	// 	}
	// });
	db.run(`DELETE FROM projects WHERE id NOT IN (${ids})`, (err) => {
		if (err) {
			console.log(err);
			return;
		}
	});
	console.log('Records deleted successfully.');
	updatedProjects = [];
};

const listToTree = (list: any) => {
	var map: any = {};
	var tree: FileTreeNodeType = {} as FileTreeNodeType;
	list.forEach((row: any) => {
		if (row.parent === '?') {
			tree = {
				id: row.id,
				key: row.id,
				label: row.name,
				path: row.path,
				type: row.type,
				modified: row.modified,
				level: row.level,
				icon: 'pi pi-fw pi-folder',
				selectable: false,
				children: []
			};
			map[row.id] = tree;
		} else {
			let child: FileTreeNodeType = {} as FileTreeNodeType;
			child.id = row.id;
			child.key = row.path;
			child.label = row.name;
			child.path = row.path;
			child.type = row.type;
			child.modified = row.modified;
			child.level = row.level;
			if (row.type === 'directory') {
				child.icon = 'pi pi-fw pi-folder';
				child.children = [];
				child.selectable = false;
			} else {
				child.icon = 'pi pi-fw pi-file';
				child.selectable = true;
			}
			map[row.id] = child;
			if (map[row.parent]) {
				map[row.parent].children.push(child);
			}
		}
	});
	// console.log('tree out');
	// console.log(map);
	// console.log('tree out');
	// console.log(tree);
	return treeSort(tree.children?.[0] || tree);
};

export const getProjectTree = () => {
	const rootParentId = '?';
	const rootId = 0;

	return new Promise<FileTreeNodeType>((resolve, reject) => {
		db.all(
			`
        WITH RECURSIVE
        under_project(parent, id, name, path, type, modified, level, visited) AS (
          VALUES (?, ?, 'name', '?', '?', '?', 0, 0)
          UNION ALL
          SELECT projects.parent_id, projects.id, projects.name, projects.path, projects.type, projects.modified, under_project.level + 1, projects.id
          FROM projects, under_project
          WHERE projects.parent_id = under_project.id AND projects.id <> under_project.visited
        )
        SELECT * FROM under_project
      `,
			[rootParentId, rootId],
			(err, rows) => {
				if (err) {
					console.error('Error:', err);
					reject(err);
					return;
				}
				const tree: FileTreeNodeType = listToTree(rows);
				resolve(tree);
			}
		);
	});
};

export const getTasks = () => {
	return new Promise((resolve, reject) => {
		db.all(`SELECT * FROM tasks`, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

export const createTask = (
	id: string,
	name: string,
	checked: boolean,
	project_id: number,
	dueDate?: string,
	priority: number = 4,
	parent_id: string = 'root'
) => {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO tasks (id, name, checked, dueDate, project_id, priority, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[id, name, checked, dueDate, project_id, priority, parent_id],
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			}
		);
	});
};

export const upsertTask = (
	id: string,
	name: string,
	checked: boolean,
	project_id: number,
	dueDate?: string,
	priority: number = 4,
	parent_id: string = 'root'
) => {
	db.run(
		`INSERT INTO tasks (
		id, name, checked, dueDate, project_id, priority, parent_id
		) 
		VALUES (?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT (id, project_id) DO UPDATE 
		SET name = ?, checked = ?, dueDate = ?, project_id = ?, priority = ?, parent_id = ?`,
		[
			id,
			name,
			checked,
			dueDate,
			project_id,
			priority,
			parent_id,
			name,
			checked,
			dueDate,
			project_id,
			priority,
			parent_id
		],
		(err) => {
			if (err) {
				console.log(err);
				console.log(
					id +
						' | ' +
						name +
						' | ' +
						checked +
						' | ' +
						project_id +
						' | ' +
						dueDate +
						' | ' +
						priority +
						' | ' +
						parent_id
				);
			} else {
				// console.log(`Row(s) updated: ${this.changes}`);
			}
		}
	);
};

export const deleteProjectTasks = (project_id: number) => {
	db.run(`DELETE FROM tasks WHERE project_id = ?`, [project_id], (err) => {
		if (err) {
			console.log(err);
			return;
		}
	});
	console.log('Records deleted successfully.');
};

export const deleteAllTasks = () => {
	db.run(`DELETE FROM tasks`, (err) => {
		if (err) {
			console.log(err);
			return;
		}
	});
	console.log('Records deleted successfully.');
};

export const listToTaskTree = (list: any) => {
	var map: any = {};
	var tree: any = {};
	console.log('List to task tree', list.length);
	try {
		list.forEach((row: any) => {
			if (row.parent_id === '?') {
				tree = {
					id: row.id,
					key: row.project_id + "/" + row.id,
					label: row.name,
					checked: row.checked,
					dueDate: row.dueDate,
					priority: row.priority,
					parent_id: row.parent_id,
					project_id: row.project_id,
					children: []
				};
				map[row.id] = tree;
			} else {
				let child: any = {};
				child.id = row.id;
				child.key = row.project_id + "/" + row.id;
				child.label = row.name;
				child.checked = row.checked;
				child.dueDate = row.dueDate;
				child.priority = row.priority;
				child.parent_id = row.parent_id;
				child.project_id = row.project_id;
				child.children = [];
				map[row.id] = child;
				if (map[row.parent_id]) {
					map[row.parent_id].children.push(child);
				}
			}
		});
	} catch (e) {
		console.log(e);
	}
	// console.log('tree out');
	// console.log(map);
	// console.log('tree out');
	// console.log(tree.children[0]);
	return taskTreeSort(tree).children;
};

export const getTaskTree = (project_id: number) => {
	const rootParentId = '?';
	const rootId = 'root';

	return new Promise<TaskTreeNode[]>((resolve, reject) => {
		db.all(
			`
				WITH RECURSIVE
				under_task(parent_id, id, name, checked, dueDate, priority, project_id, visited) AS (
					VALUES (?, ?, 'name', 0, 'dueDate', 4, ?, 'root')
					UNION ALL
					SELECT tasks.parent_id, tasks.id, tasks.name, tasks.checked, tasks.dueDate, tasks.priority, tasks.project_id, tasks.id
					FROM tasks, under_task
					WHERE tasks.parent_id = under_task.id AND tasks.id <> under_task.visited AND tasks.project_id = ?
				)
				SELECT * FROM under_task
			`,
			[rootParentId, rootId, project_id, project_id],
			(err, rows) => {
				if (err) {
					console.error('Error:', err);
					reject(err);
					return;
				}
				if (rows.length > 1) {
					console.log(rows.length);
					// console.log(listToTaskTree(rows));
					resolve(listToTaskTree(rows));
				} else {
					resolve([]);
				}
			}
		);
	});
};

export const getCheckedTasks = (project_id: number) => {
	return new Promise<CheckedTasks>((resolve, reject) => {
		db.all(
			`SELECT * FROM tasks WHERE checked = 1 AND project_id = ?`,
			[project_id],
			(err, rows) => {
				if (err) {
					reject(err);
				} else {
					let checked: CheckedTasks = {};
					rows.forEach((row: any) => {
						checked[row.project_id + "/" + row.id] = { checked: true, partialChecked: false };
					});
					resolve(checked);
				}
			}
		);
	});
};

export const getAllTaskTrees = () => {
	return new Promise<TaskTree[]>((resolve, reject) => {
		let tasks: TaskTree[] = [];

		db.serialize(() => {
			const fetchPromises: any = [];

			db.each(
				`SELECT * FROM projects`,
				async (err, row: any) => {
					if (err) {
						reject(err);
						return; // Exit the loop on error
					}

					const fetchPromise = new Promise<void>(async (innerResolve) => {
						try {
							const taskTree = await getTaskTree(row.id);
							if (taskTree.length > 0) {
								const checkedTasks = await getCheckedTasks(row.id);
								// console.log(taskTree);
								tasks.push({
									project_id: row.id,
									project_path: row.path,
									project_name: row.name,
									tasks: taskTree,
									checkedTasks: checkedTasks
								});
							}
							innerResolve();
						} catch (error) {
							reject(error);
						}
					});

					fetchPromises.push(fetchPromise);
				},
				() => {
					// This function is called when db.each() is completed
					Promise.all(fetchPromises)
						.then(() => resolve(tasks))
						.catch((error) => reject(error));
				}
			);
		});
	});
};

// export const getAllTaskTrees = () => {
// 	return new Promise<TaskTree[]>((resolve, reject) => {
// 		// get all files and for each file get tasks
// 		let tasks: TaskTree[] = [];

// 		db.each(
// 			`SELECT * FROM projects`,
// 			async (err, row: any) => {
// 				if (err) {
// 					console.log(err);
// 					reject(err);
// 				}
// 				const taskTree = await getTaskTree(row.id);
// 				console.log(taskTree);
// 				console.log(taskTree.length);
// 				if (taskTree.length > 0) {
// 					const checkedTasks = await getCheckedTasks(row.id);
// 					tasks.push({
// 						project_id: row.id,
// 						project_path: row.path,
// 						project_name: row.name,
// 						tasks: taskTree,
// 						checkedTasks: checkedTasks
// 					});
// 				}
// 			},
// 			(err,count) => {
// 				// This function is called when db.each() is completed
// 				// All tasks have been processed, so resolve the promise
// 				console.log('no of times db.each' + count);
// 				console.log(tasks);
// 				resolve(tasks);
// 			}
// 		);
// 	});
// };
// export const getAllTaskTrees = () => {
// 	return new Promise<TaskTree[]>((resolve, reject) => {
// 		// get all files and for each file get tasks
// 		let tasks: TaskTree[] = [];
// 		db.serialize(() => {
// 			db.each(`	SELECT * FROM projects`, async (err, row: any) => {
// 				if (err) {
// 					reject(err);
// 				}
// 				const taskTree = await getTaskTree(row.id);

// 				if (taskTree.length > 0) {
// 					const checkedTasks = await getCheckedTasks(row.id);
// 					tasks.push({
// 						project_id: row.id,
// 						project_path: row.path,
// 						project_name: row.name,
// 						tasks: taskTree,
// 						checkedTasks: checkedTasks
// 					});
// 				}
// 			});
// 			console.log(tasks);
// 			resolve(tasks);
// 		});
// 	});
// };
