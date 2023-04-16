import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { FC, useMemo, useEffect } from 'react';

import { Milkdown, useEditor, MilkdownProvider } from '@milkdown/react';

import { gfm } from '@milkdown/preset-gfm';
import { history } from '@milkdown/plugin-history';
import { emoji } from '@milkdown/plugin-emoji';
import { clipboard } from '@milkdown/plugin-clipboard';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { block } from '@milkdown/plugin-block';
import { prism, prismConfig } from '@milkdown/plugin-prism';
import { ListItem } from "../playground/editor-component/ListItem";
import {
  codeBlockSchema,
  commonmark,
  listItemSchema,
} from "@milkdown/preset-commonmark";
import { $view, getMarkdown } from "@milkdown/utils";
import {
  useNodeViewFactory,
  usePluginViewFactory,
  useWidgetViewFactory,
} from "@prosemirror-adapter/react";

import { nord } from '@milkdown/theme-nord';


import '@milkdown/theme-nord/style.css';

import './prism.css';
import './editor.css';
const placeholder = `# Milkdown React Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.`;

export const usePlayground = (
  defaultValue: string,
  onChange: (markdown: string) => void
) => {
  const nodeViewFactory = useNodeViewFactory();
  const pluginViewFactory = usePluginViewFactory();
  const widgetViewFactory = useWidgetViewFactory();
}

const MilkdownEditor: FC = () => {
  const nodeViewFactory = useNodeViewFactory();
	useEditor((root) => {
		return Editor.make()
			.config((ctx) => {
				const listener = ctx.get(listenerCtx);
				// ctx.set(prismConfig.key, {
				// 	configureRefractor: () => {
				// 		// return refractor;
				// 	}
				// });
				listener.updated((_, doc, prevDoc) => {
					if (doc !== prevDoc) {
						// EditorJSON.set(doc);
					}
				});
				listener.markdownUpdated((_, markdown, prevMarkdown) => {
					if (markdown !== prevMarkdown) {
						// EditorMarkdown.set(markdown);
					}
				});
				ctx.set(rootCtx, root);
				ctx.set(defaultValueCtx, placeholder);
			})
      // .config(nord)
			.use(commonmark)
			.use(gfm)
			.use(history)
			.use(emoji)
			.use(clipboard)
      .use(
        $view(listItemSchema.node, () =>
          nodeViewFactory({ component: ListItem })
        )
      )
			// .use(prism)
			// .use(block)
			.use(listener);
	}, []);

	return <Milkdown />;
};
const MilkdownEditorWrapper: React.FC = () => {
	return (
		<div className="flex w-full flex-col justify-start">
			<MilkdownProvider>
				<MilkdownEditor />
			</MilkdownProvider>
		</div>
	);
};
export default MilkdownEditorWrapper;
