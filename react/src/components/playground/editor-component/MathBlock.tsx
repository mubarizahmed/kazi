import { katexOptionsCtx } from '@milkdown/plugin-math';
import { useInstance } from '@milkdown/react';
import { useNodeViewContext } from '@prosemirror-adapter/react';
import * as Tabs from '@radix-ui/react-tabs';
import katex from 'katex';
import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

export const MathBlock: FC = () => {
  const { node, setAttrs, selected } = useNodeViewContext();
  const code = useMemo(() => node.attrs.value, [node.attrs.value]);
  const codePanel = useRef<HTMLDivElement>(null);
  const codeInput = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('preview');
  const [loading, getEditor] = useInstance();

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!codePanel.current || value !== 'preview' || loading) return;

      try {
        katex.render(code, codePanel.current, getEditor().ctx.get(katexOptionsCtx.key));
      } catch { }
    });
  }, [code, getEditor, loading, value]);

  return (
    <Tabs.Root
      contentEditable={false}
      className="my-4"
      value={value}
      onValueChange={(value) => {
        setValue(value);
      }}
    >
      <Tabs.List className=" text-center">
        <div className=" flex flex-row items-center justify-end gap-2 mb-2">
          <div className="h-[1px] w-full bg-kmedium" />
          <Tabs.Trigger
            value="preview"
            className={[
              'rounded-t-xs  inline-block border-b-2 border-transparent px-4 py-2 hover:border-klighter hover:text-klighter',
              value === 'preview' ? 'text-kaccent1' : ''
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-xs">function</span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="source"
            className={[
              'rounded-t-xs inline-block border-b-2 border-transparent px-4 py-2 hover:border-klighter hover:text-klighter',
              value === 'source' ? 'text-kaccent1' : ''
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-xs">code</span>
          </Tabs.Trigger>
        </div>
      </Tabs.List>
      <Tabs.Content value="preview">
        <div className="py-3 text-center" ref={codePanel} />
      </Tabs.Content>
      <Tabs.Content value="source" className="flex flex-col">
        <textarea
          className="block h-48 w-full ring-0 focus:outline-none rounded bg-kdark p-4 font-mono text-gray-50"
          ref={codeInput}
          defaultValue={code}
          spellCheck="false"
        />
        <div className="flex items-center justify-end gap-2 py-2">
          <button
            className="rounded-t-xs bg-transparent inline-block border-b-2 border-transparent px-4 py-2 hover:border-klighter hover:text-klighter "
            onClick={() => {
              setValue('preview');
            }}
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
          <button
            className="rounded-t-xs bg-transparent inline-block text-kaccent1 border-b-2 border-transparent px-4 py-2 hover:border-kaccent1 "
            onClick={() => {
              setAttrs({ value: codeInput.current?.value || '' });
              setValue('preview');
            }}
          >
            <span className="material-symbols-outlined text-xs ">done</span>
          </button>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};
