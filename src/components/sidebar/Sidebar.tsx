import React from 'react';
import {
	IoHome,
	IoCalendarOutline,
	IoSettingsOutline,
	IoMailOutline,
	IoFileTrayFullOutline,
	IoDocumentTextOutline
} from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import reactLogo from '../../assets/react.svg';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons';

const Sidebar = () => {

	const itemsTop = [{link: '/', icon: <IoHome />}, {link: '/calendar', icon: <IoCalendarOutline />}, {link: '/tasks', icon: <IoFileTrayFullOutline />}, {link: '/notes', icon: <IoDocumentTextOutline />}, {link: '/journal', icon: <BsClockHistory />}]
	const itemsBottom = [{link: '/settings', icon: <IoSettingsOutline />}]
	return (
		<div className="min-w-16 flex h-screen w-16 shrink-0 flex-col items-center justify-between border-r-2 border-primary-800 bg-primary-900 pb-8 pt-6">
			{/* top items */}
			<IconContext.Provider value={{ size: '1.5em', style: { verticalAlign: 'middle' } }}>
				<div className="flex flex-col items-center gap-8">
					{itemsTop.map((item, index) => {
						return (
							<NavLink
								key={index}
								className={({ isActive, isPending }) =>
									isPending
										? 'text-center text-primary-100'
										: isActive
										? 'rounded bg-secondary-400 p-2 text-primary-800'
										: 'text-center text-primary-100'
								}
								to={item.link}
							>
								{item.icon}
							</NavLink>
						);
					})
					}
				</div>
				{/* bottom items */}
				<div className="flex flex-col items-center">
					{itemsBottom.map((item, index) => {
						return (
							<NavLink
								key={index}
								className={({ isActive, isPending }) =>
									isPending
										? 'text-center text-primary-100'
										: isActive
										? 'rounded bg-secondary-400 p-2 text-primary-800'
										: 'text-center text-primary-100'
								}
								to={item.link}
							>
								{item.icon}
							</NavLink>
						);
					})}
				</div>
			</IconContext.Provider>
		</div>
	);
};

export default Sidebar;
