import { MilkdownProvider } from '@milkdown/react';
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react';
// import dynamic from "next/dynamic";
// import Head from "next/head";
// import { useRouter } from "next/router";
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import { CodemirrorRef } from '../codemirror';
import Loading from '../loading';
import type { MilkdownRef } from '../playground-editor';
import { PlaygroundMilkdown } from '../playground-editor';
import { FeatureToggleProvider } from '../playground-editor/FeatureToggleProvider';
import { InspectorProvider } from '../playground-editor/InspectorProvider';
import { ProseStateProvider } from '../playground-editor/ProseStateProvider';
import { ShareProvider } from '../playground-editor/ShareProvider';
// import { getPlaygroundTemplate } from "../pages/api/playground";
import { compose } from '../../utils/compose';
import { decode } from '../../utils/share';
import { useHotkeys, HotkeysProvider } from 'react-hotkeys-hook';
import { Toast } from 'primereact/toast';

// import '@milkdown/theme-nord/style.css';

import './editor.css';
import './prism.css';

// const electronAPI = require('window.electronAPI');

const Provider = compose(
	FeatureToggleProvider,
	MilkdownProvider,
	ProsemirrorAdapterProvider,
	ProseStateProvider,
	ShareProvider,
	InspectorProvider
);

export async function getStaticProps() {
	// const template = await getPlaygroundTemplate();
	return {
		props: {
			template: '',
			path: ''
		}
	};
}

export default function Editor({
	path,
	relativePath,
	template,
	forward,
	backward
}: {
	path: string;
	relativePath: string;
	template: string;
	forward?: ()=>void;
	backward?: ()=>void;
}) {
	const [content, setContent] = useState('');
	// const [editorContent, setEditorContent] = useState('');
	const [filePath, setFilePath] = useState('');
	const [loaded, setLoaded] = useState(false);

	var editorContent = useRef('');
	const toast = useRef<Toast>(null);
	// console.log('editor redraw', path, loaded);
	// const router = useRouter();
	// const path = router.asPath;

	// useEffect(() => {
	//   const [_, search = ""] = path.split("?");
	//   const searchParams = new URLSearchParams(search);
	//   const text = searchParams.get("text");
	//   if (text) {
	//     setContent(decode(text));
	//   }
	// }, [path]);

	const lockCodemirror = useRef(false);
	const milkdownRef = useRef<MilkdownRef>(null);
	const codemirrorRef = useRef<CodemirrorRef>(null);

	const onMilkdownChange = useCallback(
		(markdown: string) => {
			const lock = lockCodemirror.current;
			if (lock) return;
			// console.log('milkdown change 1', markdown);

			if (path === filePath) {
				editorContent.current = markdown;
				// setEditorContent(markdown);
			}
			// console.log('milkdown change 2', markdown);
			const codemirror = codemirrorRef.current;
			if (!codemirror) return;
			codemirror.update(markdown);
		},
		[path, loaded]
	);

	const onCodemirrorChange = useCallback((getCode: () => string) => {
		const { current } = milkdownRef;
		if (!current) return;
		const value = getCode();
		current.update(value);
	}, []);

	const loadFile = async (p: string) => {
		// const file = await window.electronAPI.loadFile(editorFilePath);
		// console.log('loaded file', file);
		setLoaded(false);
		setContent('');
		window.electronAPI.loadFile(p).then((file: string) => {
			setContent(file);
			console.log('loaded file');
			setLoaded(true);
		});
	};

	const saveFile = async () => {
		console.log('saving file', filePath);
		await window.electronAPI.saveFile(filePath, editorContent.current).then(() => {
			toast.current?.show({ severity: 'success', detail: 'File saved', life: 1000 });
		});
	};

	const ref = useHotkeys('ctrl+s', () => saveFile(), { scopes: ['editor'] });

	useEffect(() => {
		console.log('editor path changed', path, filePath);
		if (path !== '') {
			if (filePath !== path && filePath !== '') {
				// console.log(content);
				saveFile().then(() => {
					setFilePath(path);
					loadFile(path);
				});
			} else {
				setFilePath(path);
				loadFile(path);
			}
		} else {
			setFilePath(path);
			setContent(template);
			setLoaded(true);
		}
	}, [path]);

	useEffect(() => {
		return () => {
			if (filePath !== '') {
				// console.log(content);
				saveFile();
			}
		};
	}, []);

	return loaded ? (
		<HotkeysProvider initiallyActiveScopes={['editor']}>
			<Toast ref={toast} />
			<Provider>
				<div
					className="h-[100vh] w-full overflow-hidden overscroll-none text-primary-200 md:h-screen"
					tabIndex={-1}
				>
					<PlaygroundMilkdown
						milkdownRef={milkdownRef}
						content={content}
						onChange={onMilkdownChange}
						path={relativePath}
						onSave={saveFile}
						forward={forward}
						backward={backward}
					/>
				</div>
			</Provider>
		</HotkeysProvider>
	) : (
		<Loading />
	);
}
