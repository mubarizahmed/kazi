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
				'flex h-6 w-6 cursor-pointer items-center justify-center rounded',
				linkClass(false)
			)}
			onClick={onClick}
		>
			<span className="material-symbols-outlined !text-base text-klight">{icon}</span>
		</div>
	);
};

interface MilkdownProps {
	content: string;
	onChange: (markdown: string) => void;
	milkdownRef: RefObject<MilkdownRef>;
	path: string;
	onSave: () => void;
}

export interface MilkdownRef {
	update: (markdown: string) => void;
}

const PM: FC<MilkdownProps> = ({ path, content, onChange, onSave, milkdownRef }) => {
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
			<div className="z-50 flex h-12 items-center justify-between text-klight bg-kdark p-4 pt-4 ">
				<div className="flex gap-1">
					<Button icon="arrow_back" onClick={() => call(undoCommand.key)} />
					<Button icon="arrow_forward" onClick={() => call(redoCommand.key)} />
				</div>
				<p className="font-mono text-xs tracking-wider ">{path}</p>
				<div className="flex gap-1">

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
