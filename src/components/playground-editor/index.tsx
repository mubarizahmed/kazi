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
				'flex h-6 w-6 cursor-pointer items-center justify-center rounded',
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
	path: string;
}

export interface MilkdownRef {
	update: (markdown: string) => void;
}

export const PlaygroundMilkdown: FC<MilkdownProps> = ({ path, content, onChange, milkdownRef }) => {
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
		<div className="flex h-full w-full flex-col ">
			<div className="z-50 flex h-12 items-center justify-between bg-kdark p-4 pt-4 ">
				<div className="flex gap-1">
					<Button icon="arrow_back" onClick={() => call(undoCommand.key)} />
					<Button icon="arrow_forward" onClick={() => call(redoCommand.key)} />
				</div>
				<p className="font-mono text-xs tracking-wider text-color-base">{path.slice(17)}</p>
				<div className="flex gap-1">

					<Button icon="table" onClick={() => call(insertTableCommand.key)} />
					<Button icon="format_list_bulleted" onClick={() => call(wrapInBulletListCommand.key)} />
					<Button icon="format_list_numbered" onClick={() => call(wrapInOrderedListCommand.key)} />
					<Button icon="format_quote" onClick={() => call(wrapInBlockquoteCommand.key)} />
					<Button icon="print" />
				</div>
			</div>
			<div className="h-full overflow-y-scroll overflow-x-hidden pl-10 pr-10 ">
				<Editor />
			</div>
		</div>
	);
};
