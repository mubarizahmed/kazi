const dirTree = require('directory-tree');
const fs = require('fs');
import { FileTreeType } from '@/types';
import  TreeNode  from 'primereact/treenode';

export function loadFile(_event: any, filePath: string) {
	console.log('loadFile');
	console.log(filePath);
	var res;
	res = fs.readFileSync(filePath, { encoding: 'utf-8' }).toString();
	return res;
};

export function createFile(_event: any, filePath: string){
	console.log('createFile');
	console.log(filePath);
	let content = '# ' + filePath.split('/').slice(-1)[0].slice(0, -3);
	fs.writeFileSync(filePath, content, function (err: any) {
		if (err) return console.log(err);
	});
}

export function deleteFile(_event: any, filePath: string){
	console.log('deleteFile');
	console.log(filePath);
	// fs.rmSync(filePath, { recursive: true, force: true }, function (err: any) {
	// 	if (err) return console.log(err);
	// });
}

export function saveFile(_event: any, filePath: string, content: string) {
	console.log('saveFile');
	console.log(filePath);
	console.log(content);
	fs.writeFileSync(filePath, content, function (err: any) {
		if (err) return console.log(err);
	});
};

const directorySort = (a: FileTreeType, b: FileTreeType) => {
	if (a.type === 'directory' && b.type === 'file') {
		return -1;
	} else if (a.type === 'file' && b.type === 'directory') {
		return 1;
	} else {
		return a.name.localeCompare(b.name);
	}
};

const treeSort = (tree: FileTreeType) => {
	if (tree.children) {
		tree.children.sort(directorySort).forEach(treeSort);
	}
	return tree;
};

const transformNode = (tree: FileTreeType) => {
  var node : TreeNode = {} as TreeNode;
  node.id = tree.path;
  node.key = tree.path;
  node.label = tree.name;
	node.type = tree.type;

  if (tree.type === 'directory') {
    node.icon = "pi pi-fw pi-folder";
    node.children = tree.children?.map(transformNode);
    node.selectable = false;
  } else {
    node.icon = "pi pi-fw pi-file";
    node.selectable = true;
  }

  return node;
};


export const updateFileTree = (userDir : string) => {
  fs.access(userDir, (err: string) => {
    console.log(err ? 'no dir' : 'dir exists');
    fs.mkdirSync(userDir, { recursive: true });
  });
	const fileTree = dirTree(userDir, { extensions: /\.md$/, attributes: ['type'] });
	console.log(fileTree);

	return transformNode(treeSort(fileTree));
};
