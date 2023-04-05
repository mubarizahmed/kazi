import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
// import dynamic from "next/dynamic";
// import Head from "next/head";
// import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import { CodemirrorRef } from "../components/codemirror";
import Loading from "../components/loading";
import type { MilkdownRef } from "../components/playground-editor";
import { PlaygroundMilkdown } from "../components/playground-editor";
import { FeatureToggleProvider } from "../components/playground-editor/FeatureToggleProvider";
import { InspectorProvider } from "../components/playground-editor/InspectorProvider";
import { ProseStateProvider } from "../components/playground-editor/ProseStateProvider";
import { ShareProvider } from "../components/playground-editor/ShareProvider";
// import { getPlaygroundTemplate } from "../pages/api/playground";
import { compose } from "../utils/compose";
import { decode } from "../utils/share";



const Provider = compose(
  FeatureToggleProvider,
  MilkdownProvider,
  ProsemirrorAdapterProvider,
  ProseStateProvider,
  ShareProvider,
  InspectorProvider
);

export async function getStaticProps() {
  // const template = await getPlaygroundTemplate();
  return {
    props: {
      template:"",
    },
  };
}

export default function Playground({ template }: { template: string }) {
  const [content, setContent] = useState(template);
  // const router = useRouter();
  // const path = router.asPath;

  // useEffect(() => {
  //   const [_, search = ""] = path.split("?");
  //   const searchParams = new URLSearchParams(search);
  //   const text = searchParams.get("text");
  //   if (text) {
  //     setContent(decode(text));
  //   }
  // }, [path]);

  const lockCodemirror = useRef(false);
  const milkdownRef = useRef<MilkdownRef>(null);
  const codemirrorRef = useRef<CodemirrorRef>(null);

  const onMilkdownChange = useCallback((markdown: string) => {
    const lock = lockCodemirror.current;
    if (lock) return;

    const codemirror = codemirrorRef.current;
    if (!codemirror) return;
    codemirror.update(markdown);
  }, []);

  const onCodemirrorChange = useCallback((getCode: () => string) => {
    const { current } = milkdownRef;
    if (!current) return;
    const value = getCode();
    current.update(value);
  }, []);

  return (
    <>
        <Provider>
          <div className="h-[calc(50vh-2rem)] overflow-auto overscroll-none md:h-screen">
            <PlaygroundMilkdown
              milkdownRef={milkdownRef}
              content={content}
              onChange={onMilkdownChange}
            />
          </div>
        </Provider>
    </>
  );
}
