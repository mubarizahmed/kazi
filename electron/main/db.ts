import sqlite3 from 'sqlite3';

var db: sqlite3.Database;
var updatedProjects: number[] = [];

export const createDb = (path: string) => {
	db = new sqlite3.Database('/home/mebza/apps/kazi/kazi.sqlite', (err) => {
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
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      checked INTEGER NOT NULL,
      date TEXT NOT NULL,
      parent_id INTEGER,
      project_id INTEGER NOT NULL
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
	const placeholders = updatedProjects.map(() => '?').join(', ');

	db.run(`DELETE FROM projects WHERE id NOT IN (${placeholders})`, [updatedProjects], (err) => {
		if (err) {
			console.log(err);
		} else {
			updatedProjects = [];
		}
	});
};

function list_to_tree(list) {
	var map = {},
		node,
		roots = [],
		i;

	for (i = 0; i < list.length; i += 1) {
		map[list[i].id] = i; // initialize the map
		list[i].children = []; // initialize the children
	}

	for (i = 0; i < list.length; i += 1) {
		node = list[i];
		if (node.parent !== 0) {
			// if you have dangling branches check that map[node.parentId] exists
			list[map[node.parent]].children.push(node);
		} else {
			roots.push(node);
		}
	}
	return roots;
}

const listToTree = (list) => {
	var map = {};
	var tree = null;
	list.forEach((row) => {
		if (row.parent === '?') {
			tree = {
				id: row.id,
				key: row.id,
				name: row.name,
				path: row.path,
				modified: row.modified,
				level: row.level,
				children: []
			};
			map[row.id] = tree;
		} else {
			let child = {
				id: row.id,
				key: row.id,
				name: row.name,
				path: row.path,
				modified: row.modified,
				level: row.level,
				children: []
			};
			map[row.id] = child;
			if (map[row.parent]) {
				map[row.parent].children.push(child);
			}
      
		}
	});
	console.log('tree out');
	console.log(map);
	console.log('tree out');
	console.log(tree);
	return tree.children;
};

export const getProjectTree = () => {
	var map = {};
	var tree = {};
	console.log('getting project tree');
	db.serialize(() => {
		db.run(`DROP TABLE IF EXISTS under_project`);
		//   db.each(`
		//   WITH RECURSIVE
		//   under_project(parent,id,name, path, modified ,level) AS (
		//      VALUES('?',0,'name', '?', '?',0)
		//      UNION ALL
		//      SELECT projects.parent_id, projects.id, projects.name, projects.path, projects.modified, under_project.level+1
		//         FROM projects, under_project
		//      WHERE projects.parent_id=under_project.id
		//   )
		//   SELECT * FROM under_project
		//   `, (err, row) => {
		//     if (err) {
		//     }
		//     console.log(row.parent + '|' + row.id + '|' + row.name + '|' + row.path + '|' + row.modified + '|' + row.level);
		//   });

		const rootParentId = '?';
		const rootId = 0;

		db.all(
			`
    WITH RECURSIVE
    under_project(parent, id, name, path, modified, level, visited) AS (
      VALUES (?, ?, 'name', '?', '?', 0, 0)
      UNION ALL
      SELECT projects.parent_id, projects.id, projects.name, projects.path, projects.modified, under_project.level + 1, projects.id
      FROM projects, under_project
      WHERE projects.parent_id = under_project.id AND projects.id <> under_project.visited
    )
    SELECT * FROM under_project
  `,
			[rootParentId, rootId],
			(err, rows) => {
				if (err) {
					console.error('Error:', err);
					return;
				}
				// console.log(row.parent + '|' + row.id + '|' + row.name + '|' + row.path + '|' + row.modified + '|' + row.level);
				listToTree(rows);
			}
		);
	});
	// console.log('tree out');
	// console.log(map);
	// console.log(tree);
	// return tree
};
