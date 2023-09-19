import React, { useState } from 'react';

import kaziLogo from '/kazi_word_l.svg';
import {
	IoHome,
	IoCalendarOutline,
	IoSettingsOutline,
	IoMailOutline,
	IoFileTrayFullOutline,
	IoDocumentTextOutline
} from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Home = () => {
	const [count, setCount] = useState(0);

	return (
		<div className="App flex w-full flex-col items-center justify-center gap-4 overflow-hidden bg-kdark">
			<div className="flex flex-row">
				<a href="https://github.com/mubarizahmed/kazi" target="_blank">
					<img src={kaziLogo} className="logo fill-black" alt="Vite logo" />
				</a>
			</div>
			{/* <h1 className="text-6xl text-klight mt-2">
				Welcome to <span className="text-kaccent1">Kazi</span>!
			</h1> */}
			<hr className="m-8 h-1 w-full border-kmedium bg-kmedium" />
			<div className="grid grid-cols-3 align-middle  items-stretch justify-stretch gap-4 pl-8 pr-8">
				<Link to="/" className="w-full text-klight">
					<button className="h-30 flex w-full flex-col items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
						<IoHome className="text-3xl" />
						<div className="flex flex-col items-center justify-center text-base">
							<span>Day's overview</span>
							<span className="w-fit rounded bg-klight text-xs pl-1 pr-1 text-kdark">COMING SOON</span>
						</div>
					</button>
				</Link>
				<Link to="/" className="w-full text-klight">
					<button className="h-30 flex w-full flex-col items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
						<IoCalendarOutline className="text-3xl" />
						<div className="flex flex-col items-center justify-center text-base">Calendar <span className="w-fit rounded bg-klight text-xs pl-1 pr-1 text-kdark">COMING SOON</span></div>
					</button>
				</Link>
				<Link to="/" className="w-full text-klight">
					<button className="h-30 flex w-full flex-col items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
						<IoMailOutline className="text-3xl" />
						<div className="flex flex-col items-center justify-center text-base">Mail <span className="w-fit rounded bg-klight text-xs pl-1 pr-1 text-kdark">COMING SOON</span></div>
					</button>
				</Link>
				<Link to="/tasks" className="text-klight ">
					<button className="h-30 flex w-full flex-col items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
						<IoFileTrayFullOutline className="text-3xl" />
						<div className="text-base">Tasks</div>
					</button>
				</Link>
				<Link to="/notes" className="text-klight ">
					<button className="h-30 flex w-full flex-col items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
						<IoDocumentTextOutline className="text-3xl" />
						<div className="text-base">Notes</div>
					</button>
				</Link>
				<Link to="/playground" className="text-klight ">
					<button className="h-30 flex w-full flex-col items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
						<BsClockHistory className="text-3xl" />
						<div className="flex flex-col items-center justify-center text-base">View journals <span className="w-fit rounded bg-klight text-xs pl-1 pr-1 text-kdark">COMING SOON</span></div>
					</button>
				</Link>
				<Link to="/settings" className="text-klight ">
					<button className="h-30 flex w-full flex-col items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
						<IoSettingsOutline className="text-3xl" />
						<div className="text-base">Settings</div>
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Home;
