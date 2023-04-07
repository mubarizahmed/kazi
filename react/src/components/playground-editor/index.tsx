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
import { useImperativeHandle } from 'react';
import { usePlayground } from './usePlayground';

const Button: FC<{ icon: string; onClick?: () => void }> = ({ icon, onClick }) => {
	const linkClass = useLinkClass();
	return (
		<div
			className={clsx(
				'flex w-16 cursor-pointer items-center justify-center',
				linkClass(false)
			)}
			onClick={onClick}
		>
			<span className="material-symbols-outlined !text-base text-color-base">{icon}</span>
		</div>
	);
};

interface MilkdownProps {
	content: string;
	onChange: (markdown: string) => void;
	milkdownRef: RefObject<MilkdownRef>;
}

export interface MilkdownRef {
	update: (markdown: string) => void;
}

export const PlaygroundMilkdown: FC<MilkdownProps> = ({ content, onChange, milkdownRef }) => {
	const { loading, get } = usePlayground(content, onChange);

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

	return (
		<div className="relative h-full pt-16">
			<div className="divide-nord4 border-nord4 absolute inset-x-0 top-0 flex h-10 pl-8 pr-8 dark:divide-gray-600 dark:border-gray-600">
				<h1 className="w-full text-3xl font-semibold tracking-wider text-color-base">
					Test
				</h1>
				<Button icon="undo" onClick={() => call(undoCommand.key)} />
				<Button icon="redo" onClick={() => call(redoCommand.key)} />
				<Button icon="format_bold" onClick={() => call(toggleStrongCommand.key)} />
				<Button icon="format_italic" onClick={() => call(toggleEmphasisCommand.key)} />
				<Button icon="format_strikethrough" onClick={() => call(toggleStrikethroughCommand.key)} />
				<Button icon="table" onClick={() => call(insertTableCommand.key)} />
				<Button icon="format_list_bulleted" onClick={() => call(wrapInBulletListCommand.key)} />
				<Button icon="format_list_numbered" onClick={() => call(wrapInOrderedListCommand.key)} />
				<Button icon="format_quote" onClick={() => call(wrapInBlockquoteCommand.key)} />
        <Button icon="print" />

				<div />
			</div>
			<div className="pl-10 pr-10 h-full overflow-auto overscroll-none">
				<Editor />
			</div>
		</div>
	);
};
