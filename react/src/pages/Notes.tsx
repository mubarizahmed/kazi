import React from 'react';
import { Wysimark, useEditor } from '@wysimark/react'

const Notes = () => {
  const editor = useEditor({ initialMarkdown: "# Hello World" })
	return (
		<div className="flex h-screen w-full flex-row items-center justify-start ">
			<div className="p-8 flex h-screen flex-[2] flex-col items-center justify-start border-r-2 border-space-cadet bg-rich-black gap-8">
				<h1 className="text-2xl text-cool-gray tracking-wider w-full">NOTES</h1>
			</div>
			<div className="p-8 flex h-screen flex-[5] flex-col items-center justify-start border-r-2 border-space-cadet bg-rich-black">
				<h1 className="text-3xl font-semibold text-cool-gray tracking-wider w-full">Test</h1>
        <Wysimark editor={editor} />
			</div>
		</div>
	);
};

export default Notes;
