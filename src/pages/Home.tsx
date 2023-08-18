import React, { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
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
		<div className="App flex w-full flex-col overflow-hidden items-center justify-center gap-4 bg-kdark">
			<div className="flex flex-row">
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://reactjs.org" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1 className="text-6xl text-klight mt-2">
				Welcome to <span className="text-kaccent1">Kazi</span>!
			</h1>
      <hr className='m-8 w-full h-1 bg-kmedium border-kmedium' />
			<div className="grid pl-8  pr-8 grid-cols-3 gap-4 items-stretch justify-stretch">
        <Link to="/" className="text-klight w-full">
          <button className="flex flex-col w-full h-30 items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
            <IoHome className="text-3xl" />
            <div className="text-base">Day's overview [coming soon]</div>
          </button>
        </Link>
        <Link to="/" className="text-klight w-full">
          <button className="flex flex-col w-full h-30 items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
            <IoCalendarOutline className="text-3xl" />
            <div className="text-base">Calendar [coming soon]</div>
          </button>
        </Link>
        <Link to="/" className="text-klight w-full">
          <button className="flex flex-col w-full h-30 items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
            <IoMailOutline className="text-3xl" />
            <div className="text-base">Mail [coming soon]</div>
          </button>
        </Link>
        <Link to="/tasks" className="text-klight ">
          <button className="flex flex-col w-full h-30 items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
            <IoFileTrayFullOutline className="text-3xl" />
            <div className="text-base">Task manager</div>
          </button>
        </Link>
				<Link to="/notes" className="text-klight ">
					<button className="flex flex-col w-full h-30 items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
						<IoDocumentTextOutline className="text-3xl" />
						<div className="text-base">View and edit markdown notes</div>
					</button>
				</Link>
        <Link to="/playground" className="text-klight ">
          <button className="flex flex-col w-full h-30 items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
            <BsClockHistory className="text-3xl" />
            <div className="text-base">View journals [coming soon]</div>
          </button>
        </Link>
        <Link to="/settings" className="text-klight ">
          <button className="flex flex-col w-full h-30 items-center justify-start gap-2 rounded bg-kdark p-4 text-klight hover:border-kaccent1">
            <IoSettingsOutline className="text-3xl" />
            <div className="text-base">Settings</div>
          </button>
        </Link>

          
			</div>
		</div>
	);
};

export default Home;
