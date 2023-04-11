import { MilkdownProvider } from '@milkdown/react';
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react';
// import dynamic from "next/dynamic";
// import Head from "next/head";
// import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from 'react';

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



// import '@milkdown/theme-nord/style.css';

import './editor.css';
import './prism.css';

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
			path: '',
		}
	};
}

export default function Editor({ template, path }: { template: string, path: string}) {
	const [content, setContent] = useState(template);

	console.log('editor redraw', template);
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

	const onMilkdownChange = useCallback((markdown: string) => {

		console.log(markdown);
		const lock = lockCodemirror.current;
		if (lock) return;

		const codemirror = codemirrorRef.current;
		if (!codemirror) return;
		codemirror.update(markdown);
	}, []);

	const onCodemirrorChange = useCallback((getCode: () => string) => {
		const { current } = milkdownRef;
		if (!current) return;
		const value = getCode();
		current.update(value);
	}, []);

	useEffect(() => {
		setContent(template);
	}, [template]);

	return (
		<Provider>
			<div className="h-full w-full overflow-hidden overscroll-none md:h-screen text-color-base">
				<PlaygroundMilkdown
					milkdownRef={milkdownRef}
					content={content}
					onChange={onMilkdownChange}
					path={path}
				/>
			</div>
		</Provider>
	);
}
