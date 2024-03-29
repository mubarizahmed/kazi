import { useLinkClass } from '../../hooks';
import type { CmdKey } from '@milkdown/core';
import { editorViewCtx, parserCtx } from '@milkdown/core';
import { redoCommand, undoCommand } from '@milkdown/plugin-history';
import {
	toggleEmphasisCommand,
	toggleStrongCommand,
	wrapInBlockquoteCommand,
	wrapInBulletListCommand,
	wrapInOrderedListCommand
} from '@milkdown/preset-commonmark';
import { insertTableCommand, toggleStrikethroughCommand } from '@milkdown/preset-gfm';
import { Slice } from '@milkdown/prose/model';
import { Milkdown as Editor } from '@milkdown/react';
import { callCommand } from '@milkdown/utils';
import clsx from 'clsx';
import type { FC, RefObject } from 'react';
import { memo, useImperativeHandle, useRef } from 'react';
import { usePlayground } from './usePlayground';
import { renderToString } from 'react-dom/server'

const Button: FC<{ icon: string; onClick?: () => void }> = ({ icon, onClick }) => {
	const linkClass = useLinkClass();
	return (
		<div
			className={clsx(
				'flex h-6 w-6 cursor-pointer items-center justify-center rounded text-primary-200 hover:bg-primary-200 hover:text-primary-900',
				linkClass(false)
			)}
			onClick={onClick}
		>
			<span className="material-symbols-outlined !text-base ">{icon}</span>
		</div>
	);
};

interface MilkdownProps {
	content: string;
	onChange: (markdown: string) => void;
	milkdownRef: RefObject<MilkdownRef>;
	path: string;
	onSave: () => void;
	forward?: () => void;
	backward?: () => void;
}

export interface MilkdownRef {
	update: (markdown: string) => void;
}

const PM: FC<MilkdownProps> = ({ path, content, onChange, onSave, milkdownRef, forward, backward }) => {
	const { loading, get } = usePlayground(content, onChange, onSave);

	useImperativeHandle(milkdownRef, () => ({
		update: (markdown: string) => {
			if (loading) return;
			const editor = get();
			editor?.action((ctx) => {
				const view = ctx.get(editorViewCtx);
				const parser = ctx.get(parserCtx);
				const doc = parser(markdown);
				if (!doc) return;
				const state = view.state;
				view.dispatch(state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0)));
			});
		}
	}));

	function call<T>(command: CmdKey<T>, payload?: T) {
		return get()?.action(callCommand(command, payload));
	}

	const editorRef = useRef(null)

	const print = () => {
		let element = document.getElementById('editor-div');
		console.log(element);
		// let range = new Range();
    // range.setStart(element, 0);
    // range.setEndAfter(element, 0);
    // document.getSelection().removeAllRanges();
    // document.getSelection().addRange(range);

		var completeStyle = window.getComputedStyle(element, null).cssText;
		element.style.cssText = completeStyle;

		window.electronAPI.printFile(path, element?.outerHTML);
	}

	return (
		<div className="flex h-full w-full flex-col ">
			<div className="z-50 flex h-12 items-center justify-between text-primary-200 bg-primary-900 p-4 pt-4 ">
				<div className="flex gap-1">
					{backward ? <Button icon="arrow_back" onClick={backward} /> : <span className="h-6 w-6"></span>}
					{forward ? <Button icon="arrow_forward" onClick={forward} /> : <span className="h-6 w-6"></span>}
				</div>
				<p className="font-mono text-xs tracking-wider ">{path}</p>
				<div className="flex gap-1">
					<Button icon="undo" onClick={() => call(undoCommand.key)} />
					<Button icon="redo" onClick={() => call(redoCommand.key)} />
					<Button icon="table" onClick={() => call(insertTableCommand.key)} />
					<Button icon="format_list_bulleted" onClick={() => call(wrapInBulletListCommand.key)} />
					<Button icon="format_list_numbered" onClick={() => call(wrapInOrderedListCommand.key)} />
					<Button icon="format_quote" onClick={() => call(wrapInBlockquoteCommand.key)} />
					<Button icon="print" onClick={print}/>
				</div>
			</div>
			<div ref={editorRef} id='editor-div' className="h-full overflow-y-scroll overflow-x-hidden break-words min-w-0 pl-10 pr-10 ">
				<Editor />
			</div>
		</div>
	);
};

export const PlaygroundMilkdown = memo(PM);
