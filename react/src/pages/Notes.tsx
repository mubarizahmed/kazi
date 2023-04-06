import React from 'react';
import { MilkdownProvider } from '@milkdown/react'
import { Editor } from '../components';

const Notes = () => {

	return (
		<div className="grid grid-cols-7 h-screen w-full flex-row items-center justify-start ">
			<div className="flex h-screen col-span-2 flex-col items-center justify-start gap-8 border-r-2 border-space-cadet bg-rich-black p-8">
				<h1 className="w-full text-2xl tracking-wider text-color-base">NOTES</h1>
			</div>
			<div className="flex h-screen col-span-5 flex-col items-center justify-start border-r-2 border-space-cadet bg-rich-black pt-8 pb-8">

					<Editor template='testing'/>
			</div>
		</div>
	);
};

export default Notes;
