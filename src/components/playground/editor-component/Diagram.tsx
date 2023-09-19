// import { useDarkMode } from "@/providers";
import { useNodeViewContext } from "@prosemirror-adapter/react";
import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import mermaid from "mermaid";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState, useContext } from "react";
import { ThemeContext } from "@/App";

export const Diagram: FC = () => {
  const { node, setAttrs, selected } = useNodeViewContext();
  const code = useMemo(() => node.attrs.value, [node.attrs.value]);
  const id = node.attrs.identity;
  const codeInput = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("preview");
  const codePanel = useRef<HTMLDivElement>(null);
  const darkMode = true;
  const rendering = useRef(false);
  const { theme, setTheme } = useContext(ThemeContext);

  const renderMermaid = useCallback(async () => {
    const container = codePanel.current;
    if (!container) return;

    if (code.length === 0) return;
    if (rendering.current) return;

    console.log(theme.color1)

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: theme.color4,
        primaryTextColor: theme.color2,
        primaryBorderColor: theme.color3,
        lineColor: theme.color4,
      }
    });
    rendering.current = true;
    const { svg, bindFunctions } = await mermaid.render(id, code);
    rendering.current = false;
    container.innerHTML = svg;
    bindFunctions?.(container);
  }, [code, darkMode, id]);

  useEffect(() => {
    requestAnimationFrame(() => {
      renderMermaid();
    });
  }, [renderMermaid, value]);

  return (
    <Tabs.Root
      contentEditable={false}
      className={selected ? "ring-2 ring-offset-2" : ""}
      value={value}
      onValueChange={(value) => {
        setValue(value);
      }}
    >
      <Tabs.List className=" text-center text-klight">
        <div className=" flex flex-row items-center justify-end gap-2 mb-2">
          <div className="h-[1px] w-full bg-kmedium" />
          <Tabs.Trigger
            value="preview"
            className={[
              'rounded-t-xs  inline-block border-b-2 border-transparent px-4 py-2 hover:border-klighter hover:text-klighter',
              value === 'preview' ? 'text-kaccent1' : ''
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-xs">family_history</span>
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
      <Tabs.Content value="preview" forceMount>
        <div
          ref={codePanel}
          className={clsx(
            "flex justify-center py-3",
            value !== "preview" ? "hidden" : ""
          )}
        />
      </Tabs.Content>
      <Tabs.Content value="source" className="flex flex-col">
        <textarea
          className="block h-48 w-full focus:outline-none rounded bg-kmedium p-4 font-mono text-klight"
          ref={codeInput}
          defaultValue={code}
          spellCheck="false"
        />
        <div className="flex items-center justify-end gap-2 py-2">
          <button
            className="rounded-t-xs bg-transparent inline-block border-b-2 border-transparent px-4 py-2 hover:border-klighter text-klighter "
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
