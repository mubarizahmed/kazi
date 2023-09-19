import { deleteGroupForward } from "@codemirror/commands";
import { commandsCtx } from "@milkdown/core";
import { blockConfig, BlockProvider } from "@milkdown/plugin-block";
import {
  turnIntoTextCommand,
  wrapInHeadingCommand,
} from "@milkdown/preset-commonmark";
import { useInstance } from "@milkdown/react";
import { $command } from "@milkdown/utils";
import { deleteSelection, selectNodeForward } from '@milkdown/prose/commands'
import { usePluginViewContext } from "@prosemirror-adapter/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export const Block = () => {
  const { view } = usePluginViewContext();
  const blockProvider = useRef<BlockProvider>();
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [loading, get] = useInstance();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (element && !loading) {
      blockProvider.current ??= new BlockProvider({
        ctx: get().ctx,
        content: element,
        tippyOptions: {
          zIndex: 20,
          onBeforeUpdate: () => setShowMenu(false),
          onClickOutside: () => setShowMenu(false),
          onHide: () => setShowMenu(false),
        },
      });
    }

    return () => {
      blockProvider?.current?.destroy();
    };
  }, [loading, get, element]);

  useEffect(() => {
    blockProvider.current?.update(view);
  });

  return (
    <div className="hidden">
      <div
        className={clsx(
          "relative cursor-grab rounded-full bg-kmedium ",
          showMenu ? "ring-2 ring-offset-2" : ""
        )}
        ref={setElement}
      >
        <div onClick={() => setShowMenu((x) => !x)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            // stroke="var(--klight)"
            className="h-5 w-5 fill-klighter stroke-klighter"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </div>
        {showMenu && (
          <div className="absolute top-full mt-2 w-60 cursor-pointer rounded border-2 border-kdark bg-kmedium shadow text-klight">
            <div
              onClick={() => {
                if (loading) return;

                const commands = get().ctx.get(commandsCtx);
                commands.call(wrapInHeadingCommand.key, 1);
              }}
              className="px-6 py-3 hover:bg-kdark"
            >
              Heading 1
            </div>
            <div
              onClick={() => {
                if (loading) return;

                const commands = get().ctx.get(commandsCtx);
                commands.call(wrapInHeadingCommand.key, 2);
              }}
              className="px-6 py-3 hover:bg-kdark"
            >
              Heading 2
            </div>
            <div
              onClick={() => {
                if (loading) return;

                const commands = get().ctx.get(commandsCtx);
                commands.call(wrapInHeadingCommand.key, 3);
              }}
              className="px-6 py-3 hover:bg-kdark"
            >
              Heading 3
            </div>
            <div
              onClick={() => {
                if (loading) return;

                const commands = get().ctx.get(commandsCtx);
                commands.call(turnIntoTextCommand.key);
              }}
              className="px-6 py-3 hover:bg-kdark"
            >
              Text
            </div>
            {/* delete block */}
            <div
              onClick={() => {
                if (loading) return;
                const selectBlockCommand = $command('DeleteBlock', (ctx) => () => selectNodeForward);
                const deleteBlockCommand = $command('DeleteBlock', (ctx) => () => deleteSelection);
                const commands = get().ctx.get(commandsCtx);
                commands.call(selectBlockCommand.key);
                commands.call(deleteBlockCommand.key);
                
                
                // blockProvider.current?.destroy();
              }}
              className="px-6 py-3 hover:bg-kdark"
            >
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
