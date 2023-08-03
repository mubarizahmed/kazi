import fs from 'fs';
// import marked from 'marked';
// import Marked from 'marked'
// want to import the namespace marked from 'marked'
import { marked } from 'marked';
import { Task, Project, CheckedTasks } from '../../src/types';

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
function scanMarkdownFile(filePath: string) {
	marked.use({ breaks: true, gfm: true });
	const markdownContent = fs.readFileSync(filePath, 'utf-8');
	const tokens: marked.TokensList = marked.lexer(markdownContent, {
		walkTokens: (token: marked.Token) => {}
	});
	console.log(tokens);
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

	return filterTokens(tokens, '-0');
}

const parseTask = (taskText: string) => {

	let task = taskText
		.replace(/\[([x ])\]/, '')
		.trim()
		.split('\n')[0].split('-');
	const taskName = task[0];

	if (task.length > 1) {
		let [d, m, y] = task[1].trim().split('.');
		return {taskName, date: new Date(+y,+m-1,+d)};
	}
	return {taskName};
}

const filterTokens = (tokens: marked.Token[], key: string) => {
	const tasks: Task[] = [];
	var checkedTasks: CheckedTasks = {};
	tokens.forEach((token: marked.Token) => {
		console.log(key);
		// if list go down one level
		if (token.type === 'list' && token.items.length > 0) {
			console.log(token.items);
			let {tasks: newTasks, checkedTasks: newCheckedTasks} = filterTokens(token.items, key);
			tasks.push(...newTasks);
			checkedTasks = {...checkedTasks, ...newCheckedTasks};
			console.log((parseInt(tasks.slice(-1)[0]?.key.split('-')[1]) + 1).toString());
			key = '-' + (parseInt(tasks.slice(-1)[0]?.key.split('-')[1]) + 1).toString();

			// comes back

			// if list item check if it matches case
		} else if (token.type === 'list_item' && token.tokens.length > 0) {
			console.log(token.tokens);
			const match = token.text.match(/\[([x ])\]/);
			// if task then push to tasks
			if (match) {
				var subtasks: Task[] = [];
				const status = match[1] === 'x';
				let {taskName, date} = parseTask(token.text);
		
				// if has sub items then recursevily get them
				if (token.tokens.length > 1) {
					console.log(token.tokens);
					let {tasks: newTasks, checkedTasks: newCheckedTasks} = filterTokens(token.tokens, key + '-0');
					subtasks = newTasks;
					checkedTasks = {...checkedTasks, ...newCheckedTasks};
					tasks.push({ label: taskName, checked: status, date: date, children: subtasks, key: key });
					checkedTasks[key] = {checked: status, partialChecked: false};
				} else {
					tasks.push({ label: taskName, checked: status, date: date, key: key });
					checkedTasks[key] = {checked: status, partialChecked: false};
				}
				console.log(key.substring(key.lastIndexOf('-') + 1, key.length));
				key =
					key.substring(0, key.lastIndexOf('-') + 1) +
					(parseInt(key.substring(key.lastIndexOf('-') + 1, key.length)) + 1).toString();
				// if not task then recursevily check sub items
			} else {
				let {tasks: newTasks, checkedTasks: newCheckedTasks} = filterTokens(token.tokens, key);
				tasks.push(...newTasks);
				checkedTasks = {...checkedTasks, ...newCheckedTasks};
			}

			// if paragraph check if matches case
		} else if (token.type === 'paragraph') {
			const match = token.text.match(/\[([x ])\]/);
			var subtasks: Task[] = [];
			if (match) {
				const status = match[1] === 'x';
				let {taskName, date} = parseTask(token.text);
				tasks.push({ label: taskName, checked: status, date: date, key: key });
				checkedTasks[key] = {checked: status, partialChecked: false};
				key =
					key.substring(0, key.lastIndexOf('-') + 1) +
					(parseInt(key.substring(key.lastIndexOf('-') + 1, key.length)) + 1).toString();
			}
		}
	});
	return {tasks, checkedTasks};
};

// Example usage
// const filePath = '/home/mebza/Kazi/Projects/dashboard/dashboard app.md';
// const tasks: Task[] = scanMarkdownFile(filePath);
// console.log(tasks);

// Export a function to initiate the background task
export function startTaskScan(): Project[] {
	const filePath = '/home/mebza/Kazi/Projects/dashboard/dashboard app.md';
	console.log('startTaskScan started');
	let {tasks, checkedTasks} = scanMarkdownFile(filePath);
	console.log(tasks);
	return [{ label: 'dashboard app', children: tasks, checkedTasks }];
}
