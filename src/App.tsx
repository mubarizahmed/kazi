import { useState, useEffect, createContext } from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { Theme, ThemeHex } from './types';

export const ThemeContext = createContext({});

function App() {
	const [count, setCount] = useState(0);
	const [theme, setTheme] = useState({});
	// Listen for the theme selection event from the main process
	useEffect(() => {
		window.electronAPI.applyTheme((theme: Theme) => {
			// Apply the theme to UI
			applyTheme(theme);
			setTheme(rgbToHexTheme(theme));
			console.log('theme applied', theme);
			
		});
	}, []);

	const rgbToHexTheme = (theme: Theme) => {
		let hexTheme : ThemeHex = {} as ThemeHex;

		hexTheme.name = theme.name;
		hexTheme.type = theme.type;
		hexTheme.primary = {
			100: '#' + theme.primary[100].map((c) => c.toString(16).padStart(2,'0')).join(''),
			200: '#' + theme.primary[200].map((c) => c.toString(16).padStart(2,'0')).join(''),
			400: '#' + theme.primary[400].map((c) => c.toString(16).padStart(2,'0')).join(''),
			600: '#' + theme.primary[600].map((c) => c.toString(16).padStart(2,'0')).join(''),
			800: '#' + theme.primary[800].map((c) => c.toString(16).padStart(2,'0')).join(''),
			900: '#' + theme.primary[900].map((c) => c.toString(16).padStart(2,'0')).join('')
		};
		hexTheme.secondary = {
			200: '#' + theme.secondary[200].map((c) => c.toString(16).padStart(2,'0')).join(''),
			400: '#' + theme.secondary[400].map((c) => c.toString(16).padStart(2,'0')).join(''),
			600: '#' + theme.secondary[600].map((c) => c.toString(16).padStart(2,'0')).join('')
		};
		hexTheme.danger = '#' + theme.danger.map((c) => c.toString(16).padStart(2,'0')).join('');
		hexTheme.caution = '#' + theme.caution.map((c) => c.toString(16).padStart(2,'0')).join('');
		hexTheme.neutral = {
			100: '#' + theme.neutral[100].map((c) => c.toString(16).padStart(2,'0')).join(''),
			200: '#' + theme.neutral[200].map((c) => c.toString(16).padStart(2,'0')).join(''),
			400: '#' + theme.neutral[400].map((c) => c.toString(16).padStart(2,'0')).join(''),
			600: '#' + theme.neutral[600].map((c) => c.toString(16).padStart(2,'0')).join(''),
			800: '#' + theme.neutral[800].map((c) => c.toString(16).padStart(2,'0')).join(''),
			900: '#' + theme.neutral[900].map((c) => c.toString(16).padStart(2,'0')).join('')
		};

		return hexTheme;
	}

	// Function to apply the theme to your app's UI
	const applyTheme = (theme: any) => {
		// Update your UI with the selected theme's colors
		// For example, you can use CSS variables or a state management library like Redux to apply the theme
		document.documentElement.style.setProperty('--color-primary-100', theme.primary[100]);
		document.documentElement.style.setProperty('--color-primary-200', theme.primary[200]);
		document.documentElement.style.setProperty('--color-primary-400', theme.primary[400]);
		document.documentElement.style.setProperty('--color-primary-600', theme.primary[600]);
		document.documentElement.style.setProperty('--color-primary-800', theme.primary[800]);
		document.documentElement.style.setProperty('--color-primary-900', theme.primary[900]);
		document.documentElement.style.setProperty('--color-secondary-200', theme.secondary[200]);
		document.documentElement.style.setProperty('--color-secondary-400', theme.secondary[400]);
		document.documentElement.style.setProperty('--color-secondary-600', theme.secondary[600]);
		document.documentElement.style.setProperty('--color-danger', theme.danger);
		document.documentElement.style.setProperty('--color-caution', theme.caution);
		document.documentElement.style.setProperty('--color-neutral-100', theme.neutral[100]);
		document.documentElement.style.setProperty('--color-neutral-200', theme.neutral[200]);
		document.documentElement.style.setProperty('--color-neutral-400', theme.neutral[400]);
		document.documentElement.style.setProperty('--color-neutral-600', theme.neutral[600]);
		document.documentElement.style.setProperty('--color-neutral-800', theme.neutral[800]);
		document.documentElement.style.setProperty('--color-neutral-900', theme.neutral[900]);
	};

	return (
		<ThemeContext.Provider value={{ theme: theme, setTheme: setTheme }}>
			<div className=" default flex w-screen flex-row overflow-hidden bg-primary-200">
				<Sidebar />
				<Outlet />
			</div>
		</ThemeContext.Provider>
	);
}

export default App;
