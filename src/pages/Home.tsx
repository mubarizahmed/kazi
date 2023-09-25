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
		<div className="App flex w-full flex-col items-center justify-center gap-4 overflow-hidden bg-primary-900">
			<div className="flex flex-row">
				<a href="https://github.com/mubarizahmed/kazi" target="_blank">
					<img src={kaziLogo} className="logo fill-black" alt="Vite logo" />
				</a>
			</div>
			{/* <h1 className="text-6xl text-primary-200 mt-2">
				Welcome to <span className="text-secondary-400">Kazi</span>!
			</h1> */}
			<hr className="m-8 w-full border-t-2 border-primary-800" />
			<div className="grid grid-cols-3 items-stretch  justify-stretch gap-4 pl-8 pr-8 align-middle">
				<Link to="/" >
					<button className="min-h-30 flex h-full w-full flex-col items-center justify-start gap-2 rounded bg-transparent p-4 text-primary-200 hover:border-secondary-400">
						<IoHome className="text-3xl" />
						<div className="flex flex-col items-center justify-center text-base">
							<span>Day's overview</span>
							<span className="w-fit rounded bg-primary-200 pl-1 pr-1 text-xs text-kdark">
								COMING SOON
							</span>
						</div>
					</button>
				</Link>
				<Link to="/" >
					<button className="min-h-30 flex h-full w-full flex-col items-center justify-start gap-2 rounded bg-transparent p-4 text-primary-200 hover:border-secondary-400">
						<IoCalendarOutline className="text-3xl" />
						<div className="flex flex-col items-center justify-center text-base">
							Calendar{' '}
							<span className="w-fit rounded bg-primary-200 pl-1 pr-1 text-xs text-kdark">
								COMING SOON
							</span>
						</div>
					</button>
				</Link>
				<Link to="/" >
					<button className="min-h-30 flex h-full w-full flex-col items-center justify-start gap-2 rounded bg-transparent p-4 text-primary-200 hover:border-secondary-400">
						<IoMailOutline className="text-3xl" />
						<div className="flex flex-col items-center justify-center text-base">
							Mail{' '}
							<span className="w-fit rounded bg-primary-200 pl-1 pr-1 text-xs text-kdark">
								COMING SOON
							</span>
						</div>
					</button>
				</Link>
				<Link to="/tasks">
					<button className="min-h-30 flex h-full w-full flex-col items-center justify-start gap-2 rounded bg-transparent p-4 text-primary-200 hover:border-secondary-400">
						<IoFileTrayFullOutline className="text-3xl" />
						<div className="text-base">Tasks</div>
					</button>
				</Link>
				<Link to="/notes">
					<button className="min-h-30 flex h-full w-full flex-col items-center justify-start gap-2 rounded bg-transparent p-4 text-primary-200 hover:border-secondary-400">
						<IoDocumentTextOutline className="text-3xl" />
						<div className="text-base">Notes</div>
					</button>
				</Link>
				<Link to="/playground">
					<button className="min-h-30 flex h-full w-full flex-col items-center justify-start gap-2 rounded bg-transparent p-4 text-primary-200 hover:border-secondary-400">
						<BsClockHistory className="text-3xl" />
						<div className="flex flex-col items-center justify-center text-base">
							View journals{' '}
							<span className="w-fit rounded bg-primary-200 pl-1 pr-1 text-xs text-kdark">
								COMING SOON
							</span>
						</div>
					</button>
				</Link>
				<Link to="/settings">
					<button className="min-h-30 flex h-full w-full flex-col items-center justify-start gap-2 rounded bg-transparent p-4 text-primary-200 hover:border-secondary-400">
						<IoSettingsOutline className="text-3xl" />
						<div className="text-base">Settings</div>
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Home;
