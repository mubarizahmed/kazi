import { useNodeViewContext } from '@prosemirror-adapter/react';
import type { FC } from 'react';

export const FootnoteRef: FC = () => {
	const { node } = useNodeViewContext();
	const label = node.attrs.label;

	return (
		<sup>
			<a id={`footnote-${label}-ref`} className="text-kaccent1" href={`#footnote-${label}-def`}>
				{label}
			</a>
		</sup>
	);
};

export const FootnoteDef: FC = () => {
	const { node, contentRef } = useNodeViewContext();
	const label = node.attrs.label;
	return (
		<dl className="relative flex items-center gap-2 rounded bg-kdark p-3" id={`footnote-${label}-def`}>
			<dt className="text-kaccent1">{label}:</dt>
			<dd className="not-prose min-w-0" ref={contentRef} />
			<div
				contentEditable="false"
				suppressContentEditableWarning
				className=" cursor-pointer"
			>
				<a className="p-2 text-kaccent1" href={`#footnote-${label}-ref`}>
					↩
				</a>
			</div>
		</dl>
	);
};
