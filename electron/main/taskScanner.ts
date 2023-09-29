import fs from 'fs';
// import marked from 'marked';
// import Marked from 'marked'
// want to import the namespace marked from 'marked'
import { marked } from 'marked';
import { Task, Project, CheckedTasks, TaskTreeNode } from '../../src/types';
import {
	createTask,
	deleteAllTasks,
	deleteProjectTasks,
	getMarkdownProjects,
	getProject,
	getTaskTree,
	upsertTask
} from './db';
import { insert } from '@milkdown/utils';
import { store } from '.';

// interface Task {
// 	taskName: string;
// 	status: boolean;
// 	subtasks: Task[];
// }

// interface Project {
//   name: string;
//   tasks: Task[];
// }

// Function to scan and parse a markdown file
const scanMarkdownFile = async (filePath: string) => {
	// delete existing tasks in db
	let fileId = fs.statSync(filePath).ino;
	deleteProjectTasks(fileId);
	// get tokens from markdown file
	marked.use({ breaks: true, gfm: true });
	const markdownContent = fs.readFileSync(filePath, 'utf-8');
	const tokens: marked.TokensList = marked.lexer(markdownContent, {
		walkTokens: (token: marked.Token) => {}
	});
	// console.log(tokens);
	//   console.log(marked.Lexer.rules.block); // all block level rules
	// console.log(marked.Lexer.rules.inline); // all inline level rules
	// 	const tasks: Task[] = [];
	// 	console.log(tokens);
	// 	tokens.forEach((token: marked.Token) => {
	// 		if (token.type === 'paragraph') {
	// 			const match = token.text.match(/\[([x ])\]/);
	// 			if (match) {
	// 				const status = match[1] === 'x';
	// 				const taskName = token.text.replace(/\[([x ])\]/, '').trim();
	// 				tasks.push({ taskName, status });
	// 			}
	// 		}
	// 	});
	await filterTokensToDb(tokens, 'root-0', fileId);
	console.log('scanMarkdownFile complete');
	return filterTokens(tokens, '-0');
};

const parseTask = (taskText: string) => {
	let task = taskText
		.replace(/\[([x ])\]/, '')
		.trim()
		.split('\n')[0]
		.split('-');
	var taskName = task[0];

	try {
		if (task.length > 1) {
			const dateFormat = store.get('dateFormat');
			console.log(dateFormat);
			// make regexp from dateFormat string
			const regexp = dateFormat
				.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
				.replace(/dd/gi, '(?<day>\\d{2})')
				.replace(/mm/gi, '(?<month>\\d{2})')
				.replace(/yyyy/gi, '(?<year>\\d{4})');

			// get date from task
			let match = task[1].match(new RegExp(regexp));
			// console.log(match);
			if (match?.length === 4) {
				let {
					groups: { day, month, year }
				} = match;
				let date = new Date(+year, +month - 1, +day).toISOString();
				return { taskName, date };
			}
			// let [d, m, y] = task[1].trim().split('.');
			// let date = new Date(+y, +m - 1, +d).toISOString();
			// return { taskName, date };
		}
	} catch (error) {
		console.log(error);
		console.log(taskText);

		taskName = task.join('-');
	}
	return { taskName };
};

const filterTokensToDb = async (tokens: marked.Token[], id: string, fileId: number) => {
	// loop through top level tokens
	const asyncTokens = tokens.map(async (token: marked.Token) => {
		// if list & not empty go down one level
		if (token.type === 'list' && token.items.length > 0) {
			let childrenId = await filterTokensToDb(token.items, id, fileId);
			if (childrenId !== id) {
				if (childrenId.split('-').length !== id.split('-').length) {
					id = childrenId.slice(0, childrenId.slice(id.length).indexOf('-') + id.length);
					// increment id
					// id =
					// 	id.substring(0, id.lastIndexOf('-') + 1) +
					// 	(parseInt(id.substring(id.lastIndexOf('-') + 1, id.length)) + 1).toString();
				} else {
					id = childrenId;
				}
			}
		}
		// if list item & not empty check if it matches case
		else if (token.type === 'list_item' && token.tokens.length > 0) {
			const match = token.text.match(/\[([x ])\]/);
			// if task then push to tasks
			if (match) {
				// increment id
				id =
					id.substring(0, id.lastIndexOf('-') + 1) +
					(parseInt(id.substring(id.lastIndexOf('-') + 1, id.length)) + 1).toString();
				// console.log(token);
				const status = match[1] === 'x';
				let { taskName, date } = parseTask(token.text);
				await upsertTask(id, taskName, status, fileId, date, 4, id.slice(0, id.lastIndexOf('-')));

				// if has sub tasks then recursevily get them
				if (token.tokens.length > 1) {
					await filterTokensToDb(token.tokens, id + '-0', fileId);
				}
			} else {
				let childrenId = await filterTokensToDb(token.tokens, id, fileId);
				if (childrenId !== id) {
					if (childrenId.split('-').length !== id.split('-').length) {
						id = childrenId.slice(0, childrenId.slice(id.length).indexOf('-') + id.length);
						// increment id
						// id =
						// 	id.substring(0, id.lastIndexOf('-') + 1) +
						// 	(parseInt(id.substring(id.lastIndexOf('-') + 1, id.length)) + 1).toString();
					} else {
						id = childrenId;
					}
				}
			}
		}
		// if paragraph check if matches case
		else if (token.type === 'paragraph') {
			const match = token.text.match(/\[([x ])\]/);
			if (match) {
				// increment id
				id =
					id.substring(0, id.lastIndexOf('-') + 1) +
					(parseInt(id.substring(id.lastIndexOf('-') + 1, id.length)) + 1).toString();
				// console.log(token);
				const status = match[1] === 'x';
				let { taskName, date } = parseTask(token.text);
				await upsertTask(id, taskName, status, fileId, date, 4, id.slice(0, id.lastIndexOf('-')));
			}
		}
	});

	try {
		const results = await Promise.all(asyncTokens);
		// All asynchronous tasks are completed here
		// console.log(results);
	} catch (error) {
		// Handle errors
		// console.error(error);
	}
	return id;
};

const filterTokens = (tokens: marked.Token[], key: string) => {
	const tasks: Task[] = [];
	var checkedTasks: CheckedTasks = {};
	tokens.forEach((token: marked.Token) => {
		// console.log(key);
		// if list go down one level
		if (token.type === 'list' && token.items.length > 0) {
			// console.log(token.items);
			let { tasks: newTasks, checkedTasks: newCheckedTasks } = filterTokens(token.items, key);
			tasks.push(...newTasks);
			checkedTasks = { ...checkedTasks, ...newCheckedTasks };
			// console.log((parseInt(tasks.slice(-1)[0]?.key.split('-')[1]) + 1).toString());
			key = '-' + (parseInt(tasks.slice(-1)[0]?.key.split('-')[1]) + 1).toString();

			// comes back

			// if list item check if it matches case
		} else if (token.type === 'list_item' && token.tokens.length > 0) {
			// console.log(token.tokens);
			const match = token.text.match(/\[([x ])\]/);
			// if task then push to tasks
			if (match) {
				var subtasks: Task[] = [];
				const status = match[1] === 'x';
				let { taskName, date } = parseTask(token.text);

				// if has sub items then recursevily get them
				if (token.tokens.length > 1) {
					// console.log(token.tokens);
					let { tasks: newTasks, checkedTasks: newCheckedTasks } = filterTokens(
						token.tokens,
						key + '-0'
					);
					subtasks = newTasks;
					checkedTasks = { ...checkedTasks, ...newCheckedTasks };
					tasks.push({
						label: taskName,
						checked: status,
						date: date,
						children: subtasks,
						key: key
					});
					checkedTasks[key] = { checked: status, partialChecked: false };
				} else {
					tasks.push({ label: taskName, checked: status, date: date, key: key });
					checkedTasks[key] = { checked: status, partialChecked: false };
				}
				// console.log(key.substring(key.lastIndexOf('-') + 1, key.length));
				key =
					key.substring(0, key.lastIndexOf('-') + 1) +
					(parseInt(key.substring(key.lastIndexOf('-') + 1, key.length)) + 1).toString();
				// if not task then recursevily check sub items
			} else {
				let { tasks: newTasks, checkedTasks: newCheckedTasks } = filterTokens(token.tokens, key);
				tasks.push(...newTasks);
				checkedTasks = { ...checkedTasks, ...newCheckedTasks };
			}

			// if paragraph check if matches case
		} else if (token.type === 'paragraph') {
			const match = token.text.match(/\[([x ])\]/);
			var subtasks: Task[] = [];
			if (match) {
				const status = match[1] === 'x';
				let { taskName, date } = parseTask(token.text);
				tasks.push({ label: taskName, checked: status, date: date, key: key });
				checkedTasks[key] = { checked: status, partialChecked: false };
				key =
					key.substring(0, key.lastIndexOf('-') + 1) +
					(parseInt(key.substring(key.lastIndexOf('-') + 1, key.length)) + 1).toString();
			}
		}
	});
	return { tasks, checkedTasks };
};

const idOrderSort = (a: TaskTreeNode, b: TaskTreeNode) => {
	let a_ids = a.id.split('-');
	let b_ids = b.id.split('-');
	for (let i = 1; i <= a_ids.length; i++) {
		if (parseInt(a_ids[i]) < parseInt(b_ids[i])) {
			return -1;
		} else if (parseInt(a_ids[i]) > parseInt(b_ids[i])) {
			return 1;
		}
	}
	return 0;
};

export const taskTreeSort = (tree: TaskTreeNode) => {
	if (tree.children) {
		tree.children.sort(idOrderSort).forEach(taskTreeSort);
	}
	return tree;
};

export const checkTask = async (_event: any, task: TaskTreeNode, checked: boolean) => {
	let file = await getProject(task.project_id);

	let fileContent = fs.readFileSync(file.path, 'utf-8');
	task.checked = checked;
	console.log(task.label, checked);

	// Define a regular expression pattern to match the task line with the specified label
	const pattern = new RegExp(`([*-]\\s*\\[)(.*)(]\\s*${task.label})`, 'g');

	// Function to replace the checkbox state based on the 'checked' parameter
	const replaceCallback = (match, match1, match2, match3) => {
		console.log(match);
		console.log(match1);
		console.log(match2);
		console.log(match3);
		console.log([match1, checked ? `x` : ` `, match3].join(''));
		return [match1, checked ? `x` : ` `, match3].join('');
	};

	// Replace the task line in the file content
	const updatedContent = fileContent.replace(pattern, replaceCallback);

	// upsert task to db
	upsertTask(
		task.id,
		task.label,
		checked,
		task.project_id,
		task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
		task.priority,
		task.parent_id
	);

	console.log('updated Task', updatedContent);
	// Write the updated content back to the file
	fs.writeFileSync(file.path, updatedContent, 'utf-8');
	return true;
};
// Example usage
// const filePath = '/home/mebza/Kazi/Projects/dashboard/dashboard app.md';
// const tasks: Task[] = scanMarkdownFile(filePath);
// console.log(tasks);

// Export a function to initiate the background task
export function startTaskScan(): Project[] {
	const filePath = '/home/mebza/Kazi/Projects/dashboard/dashboard app.md';
	console.log('startTaskScan started');
	let { tasks, checkedTasks } = scanMarkdownFile(filePath);
	// console.log(tasks);
	return [{ label: 'dashboard app', children: tasks, checkedTasks }];
}

export const scanAllFiles = async () => {
	console.time('scanAllFiles');

	deleteAllTasks();

	let projects = await getMarkdownProjects();
	projects.forEach((project: any) => {
		scanMarkdownFile(project.path);
	});
	console.timeEnd('scanAllFiles');
	return true;
};

export const addTask = async (
	_event: any,
	label: string,
	dueDate: Date | null,
	project_id: number,
	project_path: string,
	prevTask?: TaskTreeNode
) => {
	console.log('addTask started', label, project_id, project_path, prevTask);
	let fileContent = fs.readFileSync(project_path, 'utf-8');
	console.log(fileContent);
	let dateString = '';
	if (dueDate) {
		const dateFormat = store.get('dateFormat');

		dateString = dateFormat
			.replace(/dd/gi, dueDate.getDate().toString().padStart(2, '0'))
			.replace(/mm/gi, dueDate.getMonth().toString().padStart(2, '0'))
			.replace(/yyyy/gi, dueDate.getFullYear().toString().padStart(4, '20'));
		// console.log(dateString);
		dateString = ` - ${dateString}`;
	}

	if (prevTask !== undefined) {
		// regular expression to find the location of previous task
		const pattern = new RegExp(`([*-]\\s*\\[)(.*)(]\\s*${prevTask.label})`, 'g');
		// function to find loaction of previous task
		const prevTaskPos = fileContent.search(pattern);
		// regular expression to find the next new line character
		const insertPos = fileContent.substring(prevTaskPos).search(/\n/) + prevTaskPos + 1;
		let newTask = fileContent.substring(prevTaskPos, insertPos);
		newTask = newTask.slice(0, newTask.indexOf(']') + 1) + ' ' + label + dateString + ' \n';
		// insert new task
		fileContent = fileContent.slice(0, insertPos) + newTask + fileContent.slice(insertPos);
	} else {
		fileContent = fileContent.trimEnd() + '\n*   [ ] ' + label + dateString + '\n';
	}
	console.log(fileContent);

	// write new file content
	fs.writeFileSync(project_path, fileContent);

	await scanMarkdownFile(project_path);
	// setTimeout(()=>{
	// 	return getTaskTree(project_id);
	// },300);

	return getTaskTree(project_id);
};
