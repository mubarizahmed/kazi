import fs from 'fs';
// import marked from 'marked';
// import Marked from 'marked'
// want to import the namespace marked from 'marked'
import { marked } from 'marked';
import { Task, Project } from '../../src/types';

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
function scanMarkdownFile(filePath: string): Task[] {
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

const filterTokens = (tokens: marked.Token[], key: string) => {
	const tasks: Task[] = [];
	tokens.forEach((token: marked.Token) => {
		console.log(key);
		// if list go down one level
		if (token.type === 'list' && token.items.length > 0) {
			console.log(token.items);
			tasks.push(...filterTokens(token.items, key));
			console.log((parseInt(tasks.slice(-1)[0]?.key.split('-')[1]) + 1).toString());
			key = '-'+(parseInt(tasks.slice(-1)[0]?.key.split('-')[1]) + 1).toString();

			// comes back 

			// if list item check if it matches case
		}
		if (token.type === 'list_item' && token.tokens.length > 0) {
			console.log(token.tokens);
			const match = token.text.match(/\[([x ])\]/);
			// if task then push to tasks
			if (match) {
				var subtasks: Task[] = [];
				const status = match[1] === 'x';
				const taskName = token.text
					.replace(/\[([x ])\]/, '')
					.trim()
					.split('\n')[0];
				// if has sub items then recursevile get them
				if (token.tokens.length > 0) {
					console.log(token.tokens);
					subtasks = filterTokens(token.tokens, key + '-0');
				}
				tasks.push({ label: taskName, checked: status, children: subtasks, key: key });
				console.log(key.substring(key.lastIndexOf('-') + 1, key.length));
				key =
					key.substring(0, key.lastIndexOf('-') + 1) +
					(parseInt(key.substring(key.lastIndexOf('-') + 1, key.length)) + 1).toString();
				// if not task then recursevily check sub items
			} else {
				tasks.push(...filterTokens(token.tokens, key));
			}

			// if paragraph check if matches case
		} else if (token.type === 'paragraph') {
			const match = token.text.match(/\[([x ])\]/);
			var subtasks: Task[] = [];
			if (match) {
				const status = match[1] === 'x';
				const taskName = token.text.replace(/\[([x ])\]/, '').trim();
				tasks.push({ label: taskName, checked: status, children: subtasks, key });
				key =
					key.substring(0, key.lastIndexOf('-') + 1) +
					(parseInt(key.substring(key.lastIndexOf('-') + 1, key.length)) + 1).toString();
			}
		}
	});
	return tasks;
};

// Example usage
const filePath = '/home/mebza/Kazi/Projects/dashboard/dashboard app.md';
const tasks: Task[] = scanMarkdownFile(filePath);
console.log(tasks);

// Export a function to initiate the background task
export function startTaskScan(): Project[] {
	const filePath = '/home/mebza/Kazi/Projects/dashboard/dashboard app.md';
	console.log('startTaskScan started');
	const tasks = scanMarkdownFile(filePath);
	console.log(tasks);
	return [{ label: 'dashboard app', children: tasks }];
}
