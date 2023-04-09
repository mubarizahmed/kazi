import { useNodeViewContext } from '@prosemirror-adapter/react';
import clsx from 'clsx';
import type { FC } from 'react';

const langs = ['text', 'js','ts', 'html', 'css', 'json', 'markdown','java','c'];

export const CodeBlock: FC = () => {
	const { contentRef, selected, node, setAttrs } = useNodeViewContext();
	return (
		<div
			className={clsx(
				selected ? 'ProseMirror-selectednode' : '',
				'not-prose my-4 rounded  p-4 shadow bg-black'
			)}
		>
			<div
				contentEditable="false"
				suppressContentEditableWarning
				className="mb-2 flex justify-between"
			>
				<select
					className="!focus:shadow-none cursor-pointer rounded !border-0 p-2 font-mono text-xs uppercase shadow-sm focus:ring-2 focus:ring-offset-2 bg-kdark"
					value={node.attrs.language || 'text'}
					onChange={(e) => {
						setAttrs({ language: e.target.value });
					}}
				>
					{langs.map((lang) => (
						<option value={lang} key={lang}>
							{lang}
						</option>
					))}
				</select>

				<button
					className="inline-flex items-center justify-center rounded border  w-4 leading-6 shadow-sm hover:bg-gray-50 focus:ring-2 !ring-kdark focus:ring-offset-2 bg-black"
					onClick={(e) => {
						e.preventDefault();
						navigator.clipboard.writeText(node.textContent);
					}}
				>
					<span className="material-symbols-outlined text-xs text-klight">content_copy</span>
				</button>
			</div>
			<pre spellCheck={false} className="!m-0 ">
				<code ref={contentRef} />
			</pre>
		</div>
	);
};
