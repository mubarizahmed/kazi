import React, { useContext, useState } from 'react';

import kaziLogo from '/kazi_word_l.svg';
import kaziLogoDark from '/kazi_word_d.svg';
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
import { ThemeContext } from '@/App';

const Home = () => {
	const [count, setCount] = useState(0);
	const { theme, setTheme } = useContext(ThemeContext);

	return (
		<div className="App flex w-full flex-col items-center justify-center gap-4 overflow-hidden bg-primary-900">
			<div className="flex flex-row">
				<a href="https://github.com/mubarizahmed/kazi" target="_blank" >
					{/* <img src={(theme.type == 'Dark' ? kaziLogo : kaziLogoDark)} className="logo fill-black" alt="Vite logo" /> */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1006.1038 306.4116"
						className="h-28 logo fill-secondary-400"
					>
						<defs></defs>
						<title>Kazi Github</title>
						<g id="Layer_2" data-name="Layer 2">
							<g id="Layer_1-2" data-name="Layer 1">
								<path className="cls-1" d="M0,306.4116v-26.5H175.4149v26.5Z" />
								<path
									className="cls-1"
									d="M285.8662,177.6464l89.5692-84.3471h35.829l-76.8868,70.166,89.5759,116.4459H393.7229L316.09,179.5147l-30.2239,28.3622v72.0343H259.7355V0h26.1307Z"
								/>
								<path
									className="cls-1"
									d="M637.0393,149.6605V279.9112H610.9152V194.4418c-86.9614,23.5163-98.9044,49.2641-98.9044,85.4694H485.8867c-.3763-52.2481,18.6639-85.093,125.0285-109.3554V151.5223c0-29.4845-13.8113-39.9354-44.0418-39.9354-31.7226,0-45.9037,15.68-50.7562,36.9513H488.4945c5.5985-36.2053,34.3436-58.969,78.3789-58.969C604.201,89.5692,637.0393,105.9884,637.0393,149.6605Z"
								/>
								<path
									className="cls-1"
									d="M884.0858,116.8156,757.1889,256.7712H884.0858v23.14H724.344V257.5173l126.1509-141.078H726.5887v-23.14H884.0858Z"
								/>
								<path
									className="cls-1"
									d="M1006.1038,41.4275H960.57V0h45.5339Zm-9.7049,238.4837H970.2748V93.2993h26.1241Z"
								/>
							</g>
						</g>
					</svg>
				</a>
			</div>
			{/* <h1 className="text-6xl text-primary-200 mt-2">
				Welcome to <span className="text-secondary-400">Kazi</span>!
			</h1> */}
			<hr className="m-8 w-full border-t-2 border-primary-800" />
			<div className="grid grid-cols-3 items-stretch  justify-stretch gap-4 pl-8 pr-8 align-middle">
				<Link to="/">
					<button className="min-h-30 flex h-full w-full flex-col items-center justify-start gap-2 rounded bg-transparent p-4 text-primary-200 hover:border-secondary-400">
						<IoHome className="text-3xl" />
						<div className="flex flex-col items-center justify-center">
							<span>Day's overview</span>
							<span className="w-fit rounded bg-primary-200  px-1 text-xs text-primary-900">
								COMING SOON
							</span>
						</div>
					</button>
				</Link>
				<Link to="/">
					<button className="min-h-30 flex h-full w-full flex-col items-center justify-start gap-2 rounded bg-transparent p-4 text-primary-200 hover:border-secondary-400">
						<IoCalendarOutline className="text-3xl" />
						<div className="flex flex-col items-center justify-center ">
							<span>Calendar</span>
							<span className="w-fit rounded bg-primary-200  px-1 text-xs text-primary-900">
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
							<span>Journals</span>
							<span className="w-fit rounded bg-primary-200  px-1 text-xs text-primary-900">
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
