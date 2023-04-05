// import { useDarkMode } from "@/providers";
import { useNodeViewContext } from "@prosemirror-adapter/react";
import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import mermaid from "mermaid";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const Diagram: FC = () => {
  const { node, setAttrs, selected } = useNodeViewContext();
  const code = useMemo(() => node.attrs.value, [node.attrs.value]);
  const id = node.attrs.identity;
  const codeInput = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("preview");
  const codePanel = useRef<HTMLDivElement>(null);
  const darkMode = true;
  const rendering = useRef(false);

  const renderMermaid = useCallback(async () => {
    const container = codePanel.current;
    if (!container) return;

    if (code.length === 0) return;
    if (rendering.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: darkMode ? "dark" : "default",
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
      <Tabs.List className="border-b border-gray-200 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <div className="-mb-px flex flex-wrap">
          <Tabs.Trigger
            value="preview"
            className={clsx(
              "inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300",
              value === "preview" ? "text-nord9" : ""
            )}
          >
            Preview
          </Tabs.Trigger>
          <Tabs.Trigger
            value="source"
            className={clsx(
              "inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300",
              value === "source" ? "text-nord9" : ""
            )}
          >
            Source
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
      <Tabs.Content value="source" className="relative">
        <textarea
          className="block h-48 w-full bg-slate-800 font-mono text-gray-50"
          ref={codeInput}
          defaultValue={code}
        />
        <button
          className="absolute right-0 bottom-full mb-1 inline-flex items-center justify-center rounded border border-gray-600 bg-nord8 px-6 py-2 text-base font-medium leading-6 text-gray-50 shadow-sm hover:bg-blue-200 focus:ring-2 focus:ring-offset-2 dark:bg-nord9"
          onClick={() => {
            setAttrs({ value: codeInput.current?.value || "" });
            setValue("preview");
          }}
        >
          OK
        </button>
      </Tabs.Content>
    </Tabs.Root>
  );
};
