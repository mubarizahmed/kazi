import { useState, useEffect, createContext } from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

export const ThemeContext = createContext({});

function App() {
	const [count, setCount] = useState(0);
	const [theme, setTheme] = useState({
		name: 'Default Dark',
		color1: [10, 10, 26],
		color2: [13, 12, 30],
		color3: [32, 30, 60],
		color4: [131, 145, 178],
		color5: [217, 216, 218],
		accent1: [41, 182, 126],
		accent2: [249, 100, 83]
	});
	// Listen for the theme selection event from the main process
	useEffect(() => {
		window.electronAPI.applyTheme((theme) => {
			// Apply the theme to your app's UI
			applyTheme(theme);
			setTheme(rgbToHexTheme(theme));
			console.log('theme applied', theme);
		});
	}, []);

	const rgbToHexTheme = (theme) => {
		theme.color1 = '#' + theme.color1.map((c) => c.toString(16)).join('');
		theme.color2 = '#' + theme.color2.map((c) => c.toString(16)).join('');
		theme.color3 = '#' + theme.color3.map((c) => c.toString(16)).join('');
		theme.color4 = '#' + theme.color4.map((c) => c.toString(16)).join('');
		theme.color5 = '#' + theme.color5.map((c) => c.toString(16)).join('');
		theme.accent1 = '#' + theme.accent1.map((c) => c.toString(16)).join('');
		theme.accent2 = '#' + theme.accent2.map((c) => c.toString(16)).join('');
		return theme;
	}

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
		<ThemeContext.Provider value={{ theme: theme, setTheme: setTheme }}>
			<div className=" default flex w-screen flex-row overflow-hidden bg-kdark">
				<Sidebar />
				<Outlet />
			</div>
		</ThemeContext.Provider>
	);
}

export default App;
