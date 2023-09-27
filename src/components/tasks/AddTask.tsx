import React, { useState } from 'react';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';

const AddTask = ({ close }: { close: Function }) => {
	const [label, setLabel] = useState<string>('');
	const [date, setDate] = useState<string | Date | Date[] | null>(null);
	return (
		<div className="flex w-full flex-col items-start justify-start gap-2 rounded-lg border-2 border-primary-800 p-2">
			<InputTextarea
				placeholder="Task name"
				className="add-task-label"
				autoResize
				value={label}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLabel(e.target.value)}
				rows={1}
			/>
			<div className="flex w-full items-center justify-between gap-1">
				<Calendar
					value={date}
					onChange={(e: CalendarChangeEvent) => setDate(e.value)}
					showIcon
					placeholder="Due date"
				/>
				<div className="flex h-full w-full items-center justify-end gap-2">
					<button
						onClick={() => close()}
						className="pi pi-times flex h-8 w-8 flex-shrink-0 place-content-center place-items-center rounded-md bg-primary-900 p-0 text-primary-200 hover:border-primary-200"
					></button>
					<button
						onClick={() => close()}
						className="pi pi-check flex h-8 w-8 flex-shrink-0 place-content-center place-items-center rounded-md bg-primary-200 p-0 text-primary-900 hover:bg-secondary-400"
					></button>
				</div>
			</div>
		</div>
	);
};

export default AddTask;
