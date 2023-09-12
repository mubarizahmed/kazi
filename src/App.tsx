import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

function App() {
	const [count, setCount] = useState(0);

	// Listen for the theme selection event from the main process
	useEffect(() => {
		window.electronAPI.applyTheme((theme) => {
			// Apply the theme to your app's UI
			applyTheme(theme);
		});

	}, []);

	// Function to apply the theme to your app's UI
	const applyTheme = (theme: any) => {
		// Update your UI with the selected theme's colors
		// For example, you can use CSS variables or a state management library like Redux to apply the theme
		document.documentElement.style.setProperty('--color-kdarker', theme.color1);
		document.documentElement.style.setProperty('--color-kdark', theme.color2);
		document.documentElement.style.setProperty('--color-kmedium', theme.color3);
		document.documentElement.style.setProperty('--color-klight', theme.color4);
		document.documentElement.style.setProperty('--color-klighter', theme.color5);
		document.documentElement.style.setProperty('--color-kaccent1', theme.accent1);
		document.documentElement.style.setProperty('--color-kaccent2', theme.accent2);
	};

	return (
		<div className=" default flex w-screen flex-row overflow-hidden bg-kdark">
			<Sidebar />
			<Outlet />
		</div>
	);
}

export default App;
