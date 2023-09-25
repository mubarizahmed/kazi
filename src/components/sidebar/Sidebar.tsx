import React from 'react';
import { IoHome, IoCalendarOutline, IoSettingsOutline, IoMailOutline, IoFileTrayFullOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import reactLogo from '../../assets/react.svg';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';

const Sidebar = () => {
	return (
		<div className="flex shrink-0 min-w-16 h-screen w-16 flex-col items-center justify-between bg-primary-900 pb-8 pt-6 border-r-2 border-primary-800">
			{/* top items */}
			<IconContext.Provider value={{ size: '1.5em', style: { verticalAlign: 'middle' } }}>
				<div className="flex flex-col items-center gap-8">
					<Link className=" text-center" to="/">
						<IoHome className="text-primary-100" />
					</Link>
					<Link className="text-center" to="/">
						<IoCalendarOutline className="text-primary-100" />
					</Link>
					<Link className="text-center" to="/">
						<IoMailOutline className="text-primary-100" />
					</Link>
					<Link className="text-center" to="/tasks">
						<IoFileTrayFullOutline className="text-primary-100" />
					</Link>
					<Link className="text-center" to="/notes">
						<IoDocumentTextOutline className="text-primary-100" />
					</Link>
					<Link className="text-center" to="/">
						<BsClockHistory className="text-primary-100" />
					</Link>
				</div>
				{/* bottom items */}
				<div className="flex flex-col items-center">
					<Link className="text-center" to="/settings">
						<IoSettingsOutline className="text-primary-100" />
					</Link>
				</div>
			</IconContext.Provider>
		</div>
	);
};

export default Sidebar;
